import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { useStdioSocketContext } from '../../context';
import { borderRadius, colors, spacings, toPx } from '../../theme';
import { TerminalLine } from './TerminalLine';

export const TerminalOutput = () => {
  const [listRef, setListRef] = useState<HTMLUListElement | null>(null);
  const scrolledToTopRef = useRef(false);
  const classes = useCreateStyles({
    terminalLine: {
      padding: toPx(spacings.space1),
    },
    terminalOutputRoot: {
      border: `1px solid ${colors.green}`,
      borderRadius: toPx(borderRadius.borderRadius0),
      color: colors.green,
      flexGrow: 1,
      flexShrink: 1,
      listStyle: 'none',
      margin: 0,
      marginBottom: toPx(spacings.space1),
      minHeight: 0,
      overflowY: 'auto',
      padding: 0,
      '--webkit-overflow-scrolling': 'touch',
    },
  });

  const { messages } = useStdioSocketContext();

  const messageComponents = useMemo(
    () =>
      messages.map(msg => (
        <li className={classes.terminalLine} key={msg.time}>
          {msg.message.split('\n').map(line => (
            <div key={line}>
              <TerminalLine message={line} />{' '}
            </div>
          ))}
        </li>
      )),
    [classes.terminalLine, messages],
  );

  console.info(messages);

  const messagesLen = messages.length;

  const handleSetScrollTop = useCallback((e: Event) => {
    const { clientHeight, scrollHeight, scrollTop } = e.currentTarget as HTMLUListElement;
    scrolledToTopRef.current = clientHeight + scrollTop >= scrollHeight;
  }, []);

  useEffect(() => {
    if (listRef) {
      listRef.addEventListener('scroll', handleSetScrollTop);
      return () => listRef.removeEventListener('scroll', handleSetScrollTop);
    }
  }, [handleSetScrollTop, listRef]);

  useLayoutEffect(() => {
    // TODO: This isn't going to work 100% of the time.
    // If a user is scrolled up a bit, we don't want to chang their scroll position
    if (!scrolledToTopRef.current && listRef && messagesLen) {
      const allItems = listRef.querySelectorAll('li');
      const lastItem = allItems ? allItems[allItems.length - 1] : null;
      if (lastItem) lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [listRef, messagesLen]);

  return (
    <ul className={classes.terminalOutputRoot} ref={setListRef}>
      {messageComponents}
    </ul>
  );
};
