function validateForm() {
    var age = document.getElementById("age").value;
    if (isNaN(age)) {
        alert("Please enter a valid number for your age.");
        return false;
    }
    else if (age < 18) {
        alert("You must be at least 18 years old to use this website.");
        return false;
    }
    return true;
}