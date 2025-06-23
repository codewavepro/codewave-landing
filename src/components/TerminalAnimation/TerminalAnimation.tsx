import { useState, useEffect, useRef } from 'react';
import styles from './TerminalAnimation.module.scss';

type TerminalLine = {
    id: number;
    text: string;
    isCommand: boolean;
    typingSpeed?: number;
};

const DEFAULT_LINES: TerminalLine[] = [
    { id: 1, text: "user@codewave:~$ sudo systemctl start docker", isCommand: true, typingSpeed: 30 },
    { id: 2, text: "[sudo] password for user: ********", isCommand: false, typingSpeed: 10 },
    { id: 3, text: "Starting Docker: OK", isCommand: false, typingSpeed: 10 },
    { id: 4, text: "user@codewave:~$ cd /projects/codewave/core", isCommand: true, typingSpeed: 40 },
    { id: 5, text: "user@codewave:~/projects/codewave/core$ git pull origin main", isCommand: true, typingSpeed: 50 },
    { id: 6, text: "remote: Enumerating objects: 127, done.", isCommand: false, typingSpeed: 5 },
    { id: 7, text: "remote: Counting objects: 100% (127/127), done.", isCommand: false, typingSpeed: 5 },
    { id: 8, text: "remote: Compressing objects: 100% (64/64), done.", isCommand: false, typingSpeed: 5 },
    { id: 9, text: "Receiving objects: 100% (89/89), 12.45 MiB | 15.67 MiB/s, done.", isCommand: false, typingSpeed: 5 },
    { id: 10, text: "Resolving deltas: 100% (23/23), completed with 7 local objects.", isCommand: false, typingSpeed: 5 },
    { id: 11, text: "user@codewave:~/projects/codewave/core$ npm ci --production", isCommand: true, typingSpeed: 40 },
    { id: 12, text: "added 1245 packages in 15.672s", isCommand: false, typingSpeed: 5 },
    { id: 13, text: "found 0 vulnerabilities", isCommand: false, typingSpeed: 10 },
    { id: 14, text: "user@codewave:~/projects/codewave/core$ npm run build -- --mode=production", isCommand: true, typingSpeed: 50 },
    { id: 15, text: "> codewave-core@4.0.0 build", isCommand: false, typingSpeed: 5 },
    { id: 16, text: "> webpack --config build/webpack.prod.config.js", isCommand: false, typingSpeed: 5 },
    { id: 17, text: "92% after chunk asset optimization SourceMapDevToolPlugin", isCommand: false, typingSpeed: 5 },
    { id: 18, text: "assets by status 15.6 MiB [cached] 42 assets", isCommand: false, typingSpeed: 5 },
    { id: 19, text: "assets by path . 3.42 MiB", isCommand: false, typingSpeed: 5 },
    { id: 20, text: "  assets by path js/*.js 3.07 MiB", isCommand: false, typingSpeed: 5 },
    { id: 21, text: "  assets by path css/*.css 352 KiB", isCommand: false, typingSpeed: 5 },
    { id: 22, text: "Entrypoint main = js/main.4d5f6e7.js css/main.8a9b0c1.css", isCommand: false, typingSpeed: 5 },
    { id: 23, text: "cached modules 7.12 MiB (javascript) 1.23 MiB (runtime) [cached] 187 modules", isCommand: false, typingSpeed: 5 },
    { id: 24, text: "webpack 5.75.0 compiled successfully in 12567 ms", isCommand: false, typingSpeed: 10 },
    { id: 25, text: "user@codewave:~/projects/codewave/core$ node --inspect=9229 dist/server.js", isCommand: true, typingSpeed: 50 },
    { id: 26, text: "Debugger listening on ws://127.0.0.1:9229/a1b2c3d4-e5f6-7890", isCommand: false, typingSpeed: 10 },
    { id: 27, text: "For help, see: https://nodejs.org/en/docs/inspector", isCommand: false, typingSpeed: 10 },
    { id: 28, text: "2023-04-20T14:25:37.123Z [INFO]  Starting Codewave Server v4.0.0", isCommand: false, typingSpeed: 15 },
    { id: 29, text: "2023-04-20T14:25:37.456Z [INFO]  Environment: production", isCommand: false, typingSpeed: 15 },
    { id: 30, text: "2023-04-20T14:25:37.789Z [INFO]  Loading configuration from /config", isCommand: false, typingSpeed: 15 },
    { id: 31, text: "2023-04-20T14:25:38.012Z [INFO]  Database connection established", isCommand: false, typingSpeed: 15 },
    { id: 32, text: "2023-04-20T14:25:38.345Z [INFO]  Redis cache initialized", isCommand: false, typingSpeed: 15 },
    { id: 33, text: "2023-04-20T14:25:38.678Z [INFO]  WebSocket server started on port 8081", isCommand: false, typingSpeed: 15 },
    { id: 34, text: "2023-04-20T14:25:39.001Z [INFO]  HTTP server listening on port 8080", isCommand: false, typingSpeed: 15 },
    { id: 35, text: "2023-04-20T14:25:39.334Z [INFO]  GraphQL endpoint ready at /graphql", isCommand: false, typingSpeed: 15 },
    { id: 36, text: "2023-04-20T14:25:39.667Z [INFO]  All systems operational", isCommand: false, typingSpeed: 30 },
    { id: 37, text: "[INFO] Monitoring started. All systems stable.", isCommand: false, typingSpeed: 10 },
    { id: 38, text: "[INFO] Codewave deployment completed successfully.", isCommand: false, typingSpeed: 10 },
    { id: 39, text: "[INFO] Ready for requests at http://localhost:8080", isCommand: false, typingSpeed: 10 },
    { id: 40, text: "user@codewave:~/projects/codewave/core$", isCommand: true, typingSpeed: 10 },
];

const TerminalAnimation = () => {
    const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
    const [currentLine, setCurrentLine] = useState<{ text: string; isCommand: boolean }>({ text: '', isCommand: true });
    const [typingIndex, setTypingIndex] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1200);
        };

        checkScreen(); // начальная проверка

        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    useEffect(() => {
        if (currentLineIndex >= DEFAULT_LINES.length) {
            setCurrentLineIndex(0);
            setDisplayedLines([]);
            return;
        }

        const line = DEFAULT_LINES[currentLineIndex];
        const speed = line.typingSpeed || 30;

        if (typingIndex < line.text.length) {
            const timer = setTimeout(() => {
                setCurrentLine({
                    text: line.text.substring(0, typingIndex + 1),
                    isCommand: line.isCommand,
                });
                setTypingIndex(typingIndex + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else {
            const nextLineDelay = line.isCommand ? 800 : 200;
            const timer = setTimeout(() => {
                setDisplayedLines((prev) => [...prev, line]);
                setCurrentLine({ text: '', isCommand: true });
                setTypingIndex(0);
                setCurrentLineIndex(currentLineIndex + 1);

                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight + 50;
                }
            }, nextLineDelay);

            return () => clearTimeout(timer);
        }
    }, [typingIndex, currentLineIndex]);

    if (!isDesktop) return null;

    return (
        <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
                <div className={styles.terminalButtons}>
                    <span className={styles.closeButton}></span>
                    <span className={styles.minimizeButton}></span>
                    <span className={styles.maximizeButton}></span>
                </div>
                <div className={styles.terminalTitle}>bash — user@codewave</div>
            </div>
            <div className={styles.terminalBody} ref={terminalRef}>
                {displayedLines.map((line, index) => (
                    <div
                        key={`${line.id}-${index}`}
                        className={`${styles.terminalLine} ${line.isCommand ? styles.command : styles.output}`}
                    >
                        <span className={styles.linePrefix}>
                            {line.isCommand ? (
                                <span className={styles.user}>user@codewave</span>
                            ) : (
                                <span className={styles.outputPrefix}>&gt;</span>
                            )}
                        </span>
                        <span className={styles.lineText}>{line.text}</span>
                    </div>
                ))}
                <div className={`${styles.terminalLine} ${currentLine.isCommand ? styles.command : styles.output}`}>
                    <span className={styles.linePrefix}>
                        {currentLine.isCommand ? (
                            <span className={styles.user}>user@codewave</span>
                        ) : (
                            <span className={styles.outputPrefix}>&gt;</span>
                        )}
                    </span>
                    <span className={styles.lineText}>{currentLine.text}</span>
                    <span className={styles.cursor}>█</span>
                </div>
            </div>
        </div>
    );
};

export default TerminalAnimation;