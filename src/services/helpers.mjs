const cleanLyrics = (lyrics) => {
    if(!lyrics) return '';
    let result = lyrics.toString();
    result = result.replace(/(<([^>]+)>)/gi, "");
    result = result.replace(/ *\([^)]*\) */g, "");
    result = result.replace(/(\[.*?\])/g, '');
    result = result.replace(/\n\s*\n\s*\n/g, '\n');
    result = result.replace(/(^[ \t]*\n)/gm, "")
    result = result.replace('gtrsvfsdx', '');
    return result;
}

const helpers = {
    cleanLyrics
}

export default helpers;