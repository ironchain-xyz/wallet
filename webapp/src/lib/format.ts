export function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const diff = Math.abs(Date.now() - date.valueOf());
    if (diff > 1000 * 60 * 60 * 24) {
        return date.toLocaleDateString("en-US");
    } else if (diff > 1000 * 60 * 60) {
        return Math.floor(diff / (1000 * 60 * 60)).toString() + " hours ago";
    } else if (diff > 1000 * 60) {
        return Math.floor(diff / (1000 * 60)).toString() + " minutes ago";
    } else if (diff > 1000) {
        return Math.floor(diff / 1000).toString() + " seconds ago";
    } else {
        return "Just now";
    }
}

export function formatFileSize(size: number) {
    if (!size) {
        return "Unknown Size"
    }
    if (size < 1024) {
        return size.toFixed(1) + "B";
    }
    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1).toString() + "KB";
    }
    if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(1).toString() + "MB";
    }
    return "> 1GB";
}