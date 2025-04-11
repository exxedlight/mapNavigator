import "./style.css";

interface MessageComponentProps{
    text: string;
}

const MessageComponent = (
    {text}:MessageComponentProps
) => {
    return (
        <div className="message-div">
            <p>{text}</p>
        </div>
    );
}
export default MessageComponent;