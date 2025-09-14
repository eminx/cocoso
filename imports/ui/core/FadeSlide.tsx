import React, { useEffect, useState } from 'react';

// Fade Component
interface FadeProps {
  ping: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Fade: React.FC<FadeProps> = ({
  ping = false,
  style,
  children,
  ...rest
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(ping);
  }, [ping]);

  let className = 'cocoso-fade';
  if (show) {
    className += ` cocoso-fade-ping`;
  }

  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
};

interface SlideProps extends FadeProps {
  direction: string;
}

export const Slide: React.FC<SlideProps> = ({
  ping = false,
  direction = 'bottom',
  style,
  children,
  ...rest
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (ping) {
      setShow(true);
    }
  }, [ping]);

  let className = `cocoso-slide cocoso-slide-${direction}`;
  if (show) {
    className += ` cocoso-slide-${direction}-ping`;
  }

  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
};

export default { Fade, Slide };
