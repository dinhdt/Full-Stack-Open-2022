const Notification = ({ messageObj }) => {
    if (messageObj === null) {
      return null
    }
  
    return (
      <div className={messageObj.isError? 'error' : 'notification'}>
        {messageObj.message}
      </div>
    )
  }

  export default Notification