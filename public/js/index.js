const lucide = window.lucide;
const Alpine = window.Alpine;

document.addEventListener('alpine:init', () => {
	Alpine.store('notifications', {
		items: [],
		notify(message) {
			this.items.push(message);
		},
	});
});

lucide.createIcons();
