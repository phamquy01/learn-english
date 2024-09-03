const focusContentEditable = () => {
if (contentEditableRef.current) {
contentEditableRef.current.focus();
}
};

const isCursorAtEnd = () => {
const selection = window.getSelection();

    return selection?.anchorOffset === selection?.anchorNode?.nodeValue?.length;

};

const fetchSuggestions = async (text: string) => {
if (text.trim().length) {
setLoading(true);
await apiTranslateRequest
.getTranslationSuggesstion(text)
.then((res) => {
setAIText(
res.payload.suggestions && res.payload.suggestions.length > 0
? res.payload.suggestions[0].slice(text.length)
: ''
);
setLoading(false);
})
.catch((error) => {
console.error('Error fetching AI text:', error);
setLoading(false);
});
}
};

const handleInput = async (e: React.ChangeEvent<HTMLDivElement>) => {
e.preventDefault();

    let newText = e.target.innerText;

    if (enterPressed && newText.endsWith('\n\n')) {
      newText = newText.slice(0, -1);
      enterPressed = false;
    }

    setInput(newText);
    setAIText('');

    if (isCursorAtEnd()) {
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
      }, 1500);
    }

};

const setCursorToEnd = (element: HTMLElement) => {
const range = document.createRange();
const selection = window.getSelection();
if (selection !== null) {
range.selectNodeContents(element as Node);
range.collapse(false);
selection.removeAllRanges();
selection.addRange(range);
}
};

const acceptSuggestion = () => {
const contentEditableElement = contentEditableRef.current;
if (contentEditableElement) {
setInput(input + aiText);
contentEditableElement.innerText = input + aiText;
setAIText('');
setCursorToEnd(contentEditableElement);
}
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
if (e.key === 'Tab') {
e.preventDefault();
acceptSuggestion();
}
if (e.key === 'Enter') {
// Set the flag to true when Enter is pressed
enterPressed = true;

      // Allow the default Enter key behavior to occur
      setTimeout(() => {
        const contentEditableElement = contentEditableRef.current;
        if (contentEditableElement) {
          const childNodes = Array.from(contentEditableElement.childNodes);

          // Find the last <br> element
          for (let i = childNodes.length - 1; i >= 0; i--) {
            if (childNodes[i].nodeName === 'BR') {
              // Remove the last <br> element
              contentEditableElement.removeChild(childNodes[i]);
              break; // Exit the loop after removing the <br>
            }
          }

          // Insert an empty text node with a zero-width space
          const emptyTextNode = document.createTextNode('\u200B');
          contentEditableElement.appendChild(emptyTextNode);

          // Set cursor after the empty text node
          setCursorToEnd(contentEditableElement);
        }
      }, 0);
    }

};

// const handleRemoveAllInput = () => {
// const contentEditableElement = contentEditableRef.current;
// if (contentEditableElement) {
// setInput('');
// setOutput('');
// contentEditableElement.innerText = '';
// setAIText('');
// setCursorToEnd(contentEditableElement);
// }
// };

   <div
              onClick={focusContentEditable}
              suppressContentEditableWarning={true}
              className="p-4 border shadow cursor-text rounded-lg text-left w-[600px] h-[200px] mx-auto overflow-auto flex justify-between w-full"
            >
              <div>
                <span
                  ref={contentEditableRef}
                  className="border-0 text-xs outline-none"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  data-name="input"
                >
                  {/* {input } */}
                </span>

                <span
                  className={`text-xs text-gray-600 transition-opacity duration-500 ${
                    aiText ? 'opacity-100' : 'opacity-0'
                  }`}
                  contentEditable={false}
                >
                  {aiText && aiText.length && (
                    <>
                      {aiText}
                      <span
                        onClick={() => {
                          acceptSuggestion();
                        }}
                        className="border p-1.5 py-0.5 text-[10px] ml-1 inline-block w-fit rounded-md border-gray-300 cursor-pointer"
                      >
                        Tab
                      </span>
                    </>
                  )}
                </span>
              </div>
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={handleRemoveAllInput}
              >
                X
              </Button>
            </div>
