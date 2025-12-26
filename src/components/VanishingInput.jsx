import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, forwardRef } from "react";

const VanishingInput = forwardRef(({
  placeholders,
  onChange,
  value,
  className,
  inputClassName,
  onSubmit,
  type = "text",
  ...props
}, ref) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef(null);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [placeholders]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders, handleVisibilityChange]);

  const handleKeyDown = (e) => {
      if (e.key === "Enter" && onSubmit) {
        onSubmit(e);
      }
  };

  return (
      <div className={`relative ${className || ""}`}>
           <input
              {...props}
              ref={ref}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              className={`${inputClassName} bg-transparent`}
              type={type}
              style={{
                  minHeight: '44px' // Ensure minimum height for touch targets
              }}
          />
          <AnimatePresence mode="wait">
              {!value && (
                  <motion.p
                      initial={{
                          y: 5,
                          opacity: 0,
                      }}
                      key={`current-placeholder-${currentPlaceholder}`}
                      animate={{
                          y: 0,
                          opacity: 1,
                      }}
                      exit={{
                          y: -5,
                          opacity: 0,
                      }}
                      transition={{
                          duration: 0.3,
                          ease: "linear",
                      }}
                      className={`absolute inset-0 flex items-center pointer-events-none text-gray-500 overflow-hidden truncate px-4 ${inputClassName?.includes('pl-') ? '' : 'pl-4'} ${inputClassName?.includes('text-') ? '' : 'text-sm'}`}
                  >
                        {/* We use a span with same padding as input text usually starts - adjusting for the icon padding */}
                        <span className={`${inputClassName?.match(/pl-\[.+\]|pl-\d+/)?.[0] || 'pl-3'}`}>
                            {placeholders && placeholders.length > 0 ? placeholders[currentPlaceholder] : ''}
                        </span>
                  </motion.p>
              )}
          </AnimatePresence>
      </div>
  );
});

export default VanishingInput;
