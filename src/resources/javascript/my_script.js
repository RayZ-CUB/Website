$('#formtype_select option').each(function () {
    if (this.defaultSelected) {
        this.selected = true;
        return false;
    }
});