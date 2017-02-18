document.addEventListener('DOMContentLoaded', handler);

function handler () {

    const converter = new showdown.Converter();
    const pad = document.getElementById('pad');
    let markdownArea = document.getElementById('markdown');

    const convertTextAreaToMarkdown = () => {
        markdownArea.innerHTML = converter.makeHtml(pad.value);
    }

    pad.addEventListener('input', convertTextAreaToMarkdown);
}