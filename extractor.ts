function getPostId(): string | null {
    const linkedinURL = (document.querySelector("#url") as HTMLInputElement).value;
    const regex = /([0-9]{19})/;
    const postId = regex.exec(linkedinURL)?.pop();
    return postId || null;
  }
  
  function getCommentId(): string | null {
    const linkedinURL = decodeURIComponent((document.querySelector("#url") as HTMLInputElement).value);
    const regex = /fsd_comment:\((\d+),urn:li:activity:\d+\)/;
    const match = regex.exec(linkedinURL);
    return match ? match[1] : null;
  }
  
  function extractUnixTimestamp(id: string | null): number | null {
    if (!id) {
      return null;
    }
    const asBinary = BigInt(id).toString(2);
    const first41Chars = asBinary.slice(0, 41);
    const timestamp = parseInt(first41Chars, 2);
    return timestamp;
  }
  
  function unixTimestampToHumanDate(timestamp: number | null): string {
    if (!timestamp) return "";
    const dateObject = new Date(timestamp);
    return dateObject.toUTCString() + " (UTC)";
  }
  
  function unixTimestampToLocalDate(timestamp: number | null): string {
    if (!timestamp) return "";
    const dateObject = new Date(timestamp);
    return formatLocalTime(dateObject);
  }
  
  function formatLocalTime(dateObject: Date): string {
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const day = dateObject.toDateString();
    return `${day}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  
  function getDate(): void {
    const postId = getPostId();
    const commentId = getCommentId();
    
    let unixTimestamp = extractUnixTimestamp(commentId) || extractUnixTimestamp(postId);
    
    const humanDateFormat = unixTimestampToHumanDate(unixTimestamp);
    const localDateFormat = unixTimestampToLocalDate(unixTimestamp);
  
    (document.querySelector("#date") as HTMLElement).textContent = humanDateFormat;
    (document.querySelector("#localtime") as HTMLElement).textContent = localDateFormat;
  }
  
  function clearUrlField(): void {
    const urlField = document.querySelector("#url") as HTMLInputElement;
    urlField.value = "";
    urlField.focus();
  }
  