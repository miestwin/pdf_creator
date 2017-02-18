document.addEventListener('DOMContentLoaded', handler);

function handler () {

    const converter = new showdown.Converter();
    const download = document.getElementById('download');
    const pad = document.getElementById('pad');
    let markdownHidden = document.getElementById('content');
    let markdownArea = document.getElementById('markdown');

    const convertTextAreaToMarkdown = () => {
        markdownArea.innerHTML = converter.makeHtml(pad.value);
        markdownHidden.value = markdownArea.innerHTML;
    }

    pad.addEventListener('input', convertTextAreaToMarkdown);
}