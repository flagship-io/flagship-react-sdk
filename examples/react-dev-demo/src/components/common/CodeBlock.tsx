import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
SyntaxHighlighter.registerLanguage('jsx', jsx);

type CodeBlockProps = {
    className?: string;
    codeString: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ className, codeString }) => {
    return (
        <div className={className}>
            <SyntaxHighlighter
                language="javascript"
                style={darcula}
                showLineNumbers
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
