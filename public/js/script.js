document.addEventListener('DOMContentLoaded', handler);

function handler () {

    const converter = new showdown.Converter();
    const download = document.getElementById('download');
    const pad = document.getElementById('pad');
    let markdownArea = document.getElementById('markdown');

    const convertTextAreaToMarkdown = () => {
        markdownArea.innerHTML = converter.makeHtml(pad.value);
    }

    const handleDownload = event => {
        const content = encodeURI(markdownArea.innerHTML);
        fetch(`http://localhost:8000/download?content=${content}`).then(()=>{console.log('działa');}).catch(err => {console.log(err);});
    }

    pad.addEventListener('input', convertTextAreaToMarkdown);
    download.addEventListener('click', handleDownload);
}