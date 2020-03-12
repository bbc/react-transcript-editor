const localSave = (mediaUrl, fileName, data) => {
  let mediaUrlName = mediaUrl;
  // if using local media instead of using random blob name
  // that makes it impossible to retrieve from on page refresh
  // use file name
  if (mediaUrlName.includes('blob')) {
    mediaUrlName = fileName;
  }

  localStorage.setItem(`draftJs-${ mediaUrlName }`, JSON.stringify(data));
};

// eslint-disable-next-line class-methods-use-this
const isPresentInLocalStorage = (mediaUrl, fileName) => {
  if (mediaUrl !== null) {
    let mediaUrlName = mediaUrl;
    if (mediaUrl.includes('blob')) {
      mediaUrlName = fileName;
    }

    const data = localStorage.getItem(`draftJs-${ mediaUrlName }`);
    if (data !== null) {
      return true;
    }

    return false;
  }

  return false;
};

const loadLocalSavedData = (mediaUrl, fileName) => {
  let mediaUrlName = mediaUrl;
  if (mediaUrl.includes('blob')) {
    mediaUrlName = fileName;
  }
  const data = JSON.parse(localStorage.getItem(`draftJs-${ mediaUrlName }`));
  return data;
};

export { loadLocalSavedData, isPresentInLocalStorage, localSave };
