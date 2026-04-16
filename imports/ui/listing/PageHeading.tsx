import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { useAtomValue } from 'jotai';

import { Box, Center, Divider, Heading, Text } from '/imports/ui/core';
import type { Host } from '/imports/ui/types';
import { canCreateContentAtom, currentHostAtom } from '../../state';

import NewButton, { type NewButtonAnimState } from './NewButton';

export interface PageHeadingProps {
  currentHost: Host;
  listing: string;
}

// True after the intro has played once — for the whole session, across all listings.
let introShown = false;

const HEADING_EASING = 'cubic-bezier(0.6, 0, 0.05, 1)';
const HEADING_DURATION_MS = 700;
const BUTTON_INTRO_DELAY_MS = 300; // must match animation-delay in CSS
const BUTTON_INTRO_DURATION_MS = 2500 + BUTTON_INTRO_DELAY_MS; // 2800 total
const SUBTLE_DURATION_MS = 900;

export default function PageHeading({
  currentHost,
  listing,
}: PageHeadingProps) {
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const preBtnLeftRef = useRef<number | null>(null);
  // Set when FLIP finds NewButton still null (data not yet loaded) — allows
  // a retry once the atom data arrives, without looping on routes where the
  // button is genuinely hidden (e.g. /members).
  const needsRetryRef = useRef(false);

  const canCreateContent = useAtomValue(canCreateContentAtom);
  // NewButton reads currentHostAtom internally — we watch it here so the retry
  // fires when the atom arrives, not just when the currentHost prop changes.
  const currentHostFromAtom = useAtomValue(currentHostAtom);

  const [buttonVisible, setButtonVisible] = useState(introShown);
  // 'pending' = in DOM for layout measurement but visually hidden (pre-intro).
  // Once the heading animation finishes the state advances to 'intro'.
  const [buttonAnimState, setButtonAnimState] = useState<NewButtonAnimState>(
    introShown ? 'idle' : 'pending'
  );

  const location = useLocation();

  const listingInMenu = currentHost?.settings?.menu?.find(
    (item) => item.name === listing
  );
  const description = listingInMenu?.description;
  const heading = listingInMenu?.label;
  const url = `${currentHost?.host}/${listingInMenu?.name}`;
  const imageUrl = currentHost?.logo;

  // ── Record heading position before the button appears ─────────────────────
  // useEffect (not layout) is fine here — we just store a number, no DOM change.
  // It runs after each render where the button is still hidden, so the stored
  // value is always up-to-date with the heading's centered position.
  useEffect(() => {
    if (introShown || buttonVisible) return;
    const wrap = headingWrapRef.current;
    if (wrap) {
      preBtnLeftRef.current = wrap.getBoundingClientRect().left;
    }
  });

  // ── Route change ──────────────────────────────────────────────────────────
  // Intro plays once globally. Every subsequent listing-page visit plays the
  // subtle bloom instead.
  useEffect(() => {
    if (introShown) {
      setButtonAnimState('subtle');
      const t = setTimeout(() => setButtonAnimState('idle'), SUBTLE_DURATION_MS);
      return () => clearTimeout(t);
    }
    setButtonVisible(true);
  }, [location.pathname]);

  // ── FLIP — must be useLayoutEffect so the snap runs BEFORE the browser paints
  //
  // Timeline with useLayoutEffect:
  //   1. React updates DOM (button added → heading shifts left)
  //   2. useLayoutEffect fires → snaps heading back to center (transform = deltaX)
  //   3. Browser paints → user sees heading at center (never sees the jump)
  //   4. requestAnimationFrame → applies transition, clears transform → heading
  //      slides left to its natural position beside the button
  useIsomorphicLayoutEffect(() => {
    if (!buttonVisible || introShown) return;

    const wrap = headingWrapRef.current;
    const preLeft = preBtnLeftRef.current;
    if (!wrap || preLeft === null) return;

    const postLeft = wrap.getBoundingClientRect().left;
    const deltaX = preLeft - postLeft; // positive = heading shifted left

    if (Math.abs(deltaX) < 1) {
      // NewButton returned null — data not ready yet or hidden on this route.
      // Mark for retry; the retry effect will re-trigger once atoms are loaded.
      needsRetryRef.current = true;
      setButtonVisible(false);
      return;
    }

    // Mark synchronously — before the RAF — so the flag is set even if
    // the component unmounts before the RAF fires (e.g. React StrictMode cleanup).
    introShown = true;

    // Step 2: snap heading back to its pre-button (centered) position
    wrap.style.transition = 'none';
    wrap.style.transform = `translateX(${deltaX}px)`;

    // Step 4: after the browser has painted the snapped position, animate
    const rafId = requestAnimationFrame(() => {
      wrap.style.transition = `transform ${HEADING_DURATION_MS}ms ${HEADING_EASING}`;
      wrap.style.transform = '';

      // Button slides up simultaneously with heading.
      setButtonAnimState('intro');

      // Clean up heading inline transition once it has finished.
      const t1 = setTimeout(() => {
        wrap.style.transition = '';
      }, HEADING_DURATION_MS + 20);

      // After the full intro animation: return to idle.
      const t2 = setTimeout(
        () => setButtonAnimState('idle'),
        BUTTON_INTRO_DURATION_MS
      );

      wrap._flipTimers = [t1, t2];
    });

    return () => {
      cancelAnimationFrame(rafId);
      const timers = wrap._flipTimers as
        | ReturnType<typeof setTimeout>[]
        | undefined;
      timers?.forEach(clearTimeout);
      wrap.style.transition = '';
      wrap.style.transform = '';
    };
  }, [buttonVisible]);

  // ── Retry once atoms load (fixes first-page-load blank) ───────────────────
  // On initial render the atoms may not be ready yet, causing NewButton to
  // return null and the FLIP to measure deltaX≈0. needsRetryRef is set in that
  // case. When canCreateContent finally becomes truthy we try once more.
  // We do NOT include buttonVisible in deps — we only want to fire on data
  // change, not on every visibility toggle (which would loop on /members etc.).
  useEffect(() => {
    if (!introShown && needsRetryRef.current && canCreateContent && currentHostFromAtom) {
      needsRetryRef.current = false;
      setButtonVisible(true);
    }
  }, [canCreateContent, currentHostFromAtom]);

  return (
    <>
      <Helmet>
        <title>{String(heading || 'Page')}</title>
        <meta charSet="utf-8" />
        <meta name="title" content={String(heading || 'Page')} />
        <meta name="description" content={String(description || '')} />
        <meta
          property="og:title"
          content={String(heading || 'Page')?.substring(0, 40)}
        />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={String(description || '')?.substring(0, 150)}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <Center>
        <Box px="2">
          <Center position="relative">
            <div ref={headingWrapRef}>
              <Heading as="h1" size="lg" textAlign="center">
                {heading}
              </Heading>
            </div>

            {buttonVisible && <NewButton animState={buttonAnimState} />}
          </Center>
          <Box py="2">
            <Divider
              css={{
                borderColor: 'var(--cocoso-colors-theme-500)',
                minWidth: '280px',
              }}
            />
            {description && (
              <Center>
                <Text
                  size="lg"
                  css={{
                    fontWeight: '300',
                    lineHeight: '1.3',
                    maxWidth: '520px',
                    textAlign: 'center',
                  }}
                >
                  {description}
                </Text>
              </Center>
            )}
          </Box>
        </Box>
      </Center>
    </>
  );
}
