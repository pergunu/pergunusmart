/* Animation classes */
.animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fadeIn {
    animation-name: fadeIn;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-10px);
    }
}

.bounce {
    animation-name: bounce;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.pulse {
    animation-name: pulse;
}

@keyframes slideInUp {
    from {
        transform: translate3d(0, 100%, 0);
        visibility: visible;
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}

.slideInUp {
    animation-name: slideInUp;
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
    50% {
        opacity: 1;
    }
}

.zoomIn {
    animation-name: zoomIn;
}

@keyframes flipInX {
    from {
        transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
        animation-timing-function: ease-in;
        opacity: 0;
    }
    40% {
        transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
        animation-timing-function: ease-in;
    }
    60% {
        transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
        opacity: 1;
    }
    80% {
        transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    to {
        transform: perspective(400px);
    }
}

.flipInX {
    animation-name: flipInX;
    backface-visibility: visible !important;
}

/* Delays */
.delay-1s {
    animation-delay: 1s;
}

.delay-2s {
    animation-delay: 2s;
}

.delay-3s {
    animation-delay: 3s;
}

/* Durations */
.fast {
    animation-duration: 0.8s;
}

.faster {
    animation-duration: 0.5s;
}

.slow {
    animation-duration: 2s;
}

.slower {
    animation-duration: 3s;
}
