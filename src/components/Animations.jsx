'use client'

import { motion } from 'framer-motion'

export const FadeIn = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
)

export const ColorPulse = ({ color }) => (
    <motion.div
        className="absolute inset-0 rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)]"
        style={{ backgroundColor: color }}
        animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.5, 0.7],
        }}
        transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
        }}
    />
)

