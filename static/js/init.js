window.onload = () => {
    const form = document.createElement("form");
    form.method = 'POST';
    form.action = '/';

    const content = document.createElement("input");
    content.type = 'hidden';
    content.name = 'display_mode';
    content.value = screen.width > screen.height ? 'Laptop' : 'Mobile';

    form.appendChild(content);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}