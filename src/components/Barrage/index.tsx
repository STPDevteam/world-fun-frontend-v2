import React, { useEffect, useRef } from "react";
import { Box, Image } from "@chakra-ui/react";
import Danmaku from "rc-danmaku";
import './styles.css'

const Barrage = ({ messages = [], speed = 80 }) => {
    const danmakuInsRef: any = useRef(null); // Danmaku instance reference
    const isPaused = useRef(false); // Pause state
    const messageQueueRef = useRef([]); // Original message queue for reset
    const totalBulletsRef = useRef(0); // Total number of fired danmaku

    // Get random delay (0-2 seconds)
    const getRandomDelay = () => {
        return Math.random() * 20000; // 0-2000ms
    };

    // Get random start position (0-50% screen width)
    const getRandomStartPosition = () => {
        return Math.random() * 5; // 0-50%
    };

    // Initialize danmaku instance
    useEffect(() => {
        if (!danmakuInsRef.current) {
            danmakuInsRef.current = new Danmaku(".danmaku-wrapper", {
                rowHeight: 100, // Track height
                speed: speed, // Scroll speed (pixels/second)
                opacity: 1, // Opacity
                maxRow: 3, // Maximum number of tracks
                minGapWidth: 20, // Minimum gap between messages (pixels)
                onQueueRunOut: () => {
                    console.log('finished');
                    messageQueueRef.current.forEach((msg: any, index: number) => {
                        setTimeout(() => {
                            if(danmakuInsRef.current){
                                danmakuInsRef.current.push(
                                    <div 
                                        className={`gradient_border_4 barrageItem`}
                                        onClick={handlePause}
                                        onMouseEnter={() => {
                                            danmakuInsRef.current.pause();
                                            isPaused.current = true;
                                        }}
                                        onMouseLeave={() => {
                                            danmakuInsRef.current.resume();
                                            isPaused.current = false;
                                        }}
                                    >
                                        <Image
                                            src={msg.avatar || "https://via.placeholder.com/32"}
                                            alt={msg.content}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                marginRight: "20px",
                                                flexShrink: 0, // Prevent image compression
                                            }}
                                        />
                                        <div className="barrage-text">{msg.content}</div>
                                    </div>
                                );
                            }
                        }, getRandomDelay())
                    })
                },
            });
        }

        // Cleanup when component unmounts
        return () => {
            danmakuInsRef.current?.destroy();
            danmakuInsRef.current = null;
        };
    }, [speed]);

    // Handle message updates
    useEffect(() => {
        messageQueueRef.current = [...messages];
        totalBulletsRef.current = 0; // Reset count

        // Push all messages at once
        if (messages.length > 0 && danmakuInsRef.current) {
            messages.forEach((msg: any, index: number) => {
                setTimeout(() => {
                    if(danmakuInsRef.current){
                        danmakuInsRef.current.push(
                            <div 
                                className={`gradient_border_4 barrageItem`}
                                onClick={handlePause}
                                onMouseEnter={() => {
                                    danmakuInsRef.current.pause();
                                    isPaused.current = true;
                                }}
                                onMouseLeave={() => {
                                    danmakuInsRef.current.resume();
                                    isPaused.current = false;
                                }}
                                style={{
                                    // animationDelay: `${getRandomDelay()}ms`, // Random delay
                                    left: `${getRandomStartPosition()}%`, // Random start position
                                }}
                            > 
                                <Image
                                    src={msg.avatar || "https://via.placeholder.com/32"}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        marginRight: "20px",
                                        flexShrink: 0, // Prevent image compression
                                    }}
                                    alt=""
                                />
                                <div className="barrage-text">{msg.content}</div>
                            </div>
                        )
                    }
                }, index === 0 ? 0 : getRandomDelay())
            })
        }
    }, [messages]);

    // Pause/resume danmaku
    const handlePause = () => {
        if (isPaused.current) {
            danmakuInsRef.current.resume();
            isPaused.current = false;
        } else {
            danmakuInsRef.current.pause();
            isPaused.current = true;
        }
    };

    return (
        <Box
            position="absolute"
            top="100px"
            left="0"
            right="0"
            h="220px"
            zIndex={12}
            overflow="hidden"
        >
            <div
                className="danmaku-wrapper"
                style={{ width: "100%", height: "100%" }}
            />
        </Box>
    );
};

export default Barrage;