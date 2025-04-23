function loadComponent(componentName) {
    fetch(`../components/${componentName}.html`)
        .then(res => res.text())
        .then(data => {
            document.getElementById(`${componentName}-container`).innerHTML = data;
        })
        .catch(error => {
            console.error(`Error loading ${componentName}:`, error);
        });
}

// Hàm load tất cả components
function loadAllComponents() {
    loadComponent('header');
    loadComponent('menu');
    loadComponent('footer');
}

// Chạy khi trang đã load xong
document.addEventListener('DOMContentLoaded', function() {
    loadAllComponents();
});