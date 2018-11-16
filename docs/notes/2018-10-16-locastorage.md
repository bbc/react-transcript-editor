# local storage

using `mediaUrl` in `TranscriptEditor` passed to `TimedTextEditor` to set id in local storage. 

use case
You load the transcript editor for one transcript, and save

Load transcript editor for another different transcript, you want it to restore from second url, otherwise can only handle one transcript at a time in local storage.