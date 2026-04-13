import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(animate);
    };

    const onEnter = () => gsap.to(ring, { width: 56, height: 56, duration: 0.2 });
    const onLeave = () => gsap.to(ring, { width: 40, height: 40, duration: 0.2 });

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('button, a, .hoverable').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    animate();
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed', width: 10, height: 10,
        background: 'var(--acc)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'background 0.3s',
        mixBlendMode: 'difference',
        top: 0, left: 0
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 40, height: 40,
        border: '1px solid rgba(var(--acc-rgb), 0.5)',
        borderRadius: '50%', pointerEvents: 'none',
        zIndex: 9998, transform: 'translate(-50%, -50%)',
        transition: 'width 0.2s, height 0.2s, border-color 0.3s',
        top: 0, left: 0
      }} />
    </>
  );
}

export default Cursor;