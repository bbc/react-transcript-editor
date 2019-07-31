const formatSeconds = seconds => new Date(seconds.toFixed(3) * 1000).toISOString().substr(11, 12);

export default formatSeconds;