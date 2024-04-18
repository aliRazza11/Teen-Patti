interface MessageProps {
  message: String;
  className?: String;
}
function Message({ message, className }: MessageProps) {
  return (
    <div className={`message-content-container ${className ? className : ""}`}>
      {message}
    </div>
  );
}
export default Message;
