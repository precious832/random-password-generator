function createPassword(a) {
    // to stop the page from refreshing and the inputs from resetting
    a.preventDefault()

    // get the number of characters
    const num_characters = document.getElementById("num-characters").value;

    const valid_letters = () => {
        for (let letter_group of document.getElementsByName("letters")){
            if (letter_group.checked === true){
                return letter_group.value;
            }
        }
    };

    // get boolean for including digits
    const include_digits_bool = () => {
        for (let bool of document.getElementsByName("digits")){
            if (bool.checked === true) {
                return bool.value;
            }
        }
    };

    // get user's choice of symbols
    let symbols = () => {
        let checked_symbols = [];
        const valid_symbols = document.getElementsByName("symbols");
        for (let symbol of valid_symbols) {
            if (symbol.checked === true){
                checked_symbols.push(symbol.value);
            }
        }
        return checked_symbols;
    };

    // get beginning character choice
    const beginning = () => {
        for (let beginning_choice of document.getElementsByName("beginning")){
            if (beginning_choice.checked === true){
                return beginning_choice.value;
            }
        }
    };

    // build password
    let password = "";
    for (let i = 0; i < num_characters; i++){
        let random_int = Math.floor(Math.random() * 3);
        if (i === 0){
            let begin = beginning();
            if (begin === "letter" || begin === "up-letter" || begin === "low-letter"){
                    random_int = 0;
            } else if (begin === "digit"){
                random_int = 1;
            } else if (begin === "symbol"){
                random_int = 2;
            }
        }

        switch (random_int){
            case 0:
                if (valid_letters() !== "none"){
                    password += getLetter(valid_letters());
                } else {
                    i -= 1;
                }
                break;
            case 1:
                if (include_digits_bool() === "true"){
                    password += getDigit();
                } else {
                    i -= 1;
                }
                break;
            case 2:
                if (symbols().length > 0){
                    password += getSymbol(symbols());
                } else {
                    i -= 1;
                }
                break;
            default:
                break;
         }
    }
    document.getElementById("password").innerText = password;
    document.getElementById("password").hidden = false;

}

// generates a random capital or lowercase letter
function getLetter(letter_case) {
    let random_int;
    let choices = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (letter_case === "uppercase") {
        random_int = Math.floor(Math.random() * 26 + 26);
    } else if (letter_case === "lowercase") {
        random_int = Math.floor(Math.random() * 26);
    } else {
        random_int = Math.floor(Math.random() * 52)
    }
    return choices[random_int];
}

// generates a random digit
function getDigit(){
    return Math.floor(Math.random() * 10);
}

// generates a random symbol based on user selections
function getSymbol(symbol_array){
    let len = symbol_array.length;
    let int = Math.floor(Math.random() * len)
    return symbol_array[int];
}

// prevents user from being able to select a certain case as the beginning character
function disableLetters(){
    let letter_choice;
    for (let letter_group of document.getElementsByName("letters")) {
        if (letter_group.checked === true){
            letter_choice = letter_group.value;
        }
    }
        if (letter_choice === "uppercase") {
            document.getElementById("all-let").disabled = true;
            document.getElementById("up").disabled = false;
            document.getElementById("low").disabled = true;
        } else if (letter_choice === "lowercase") {
            document.getElementById("all-let").disabled = true;
            document.getElementById("up").disabled = true;
            document.getElementById("low").disabled = false;
        } else if (letter_choice === "none"){
            document.getElementById("all-let").disabled = true;
            document.getElementById("up").disabled = true;
            document.getElementById("low").disabled = true;
        } else {
            document.getElementById("all-let").disabled = false;
            document.getElementById("up").disabled = false;
            document.getElementById("low").disabled = false;
        }

}

// prevents user from selecting a digit as the beginning character
function disableDigits() {
    let digit_choice;
    for (let digit_bool of document.getElementsByName("digits")){
        if (digit_bool.checked === true){
            digit_choice = digit_bool.value;
        }
    }

    document.getElementById("dig").disabled = digit_choice === "false";
}

// prevents user from selecting a symbol as the beginning character
function disableSymbol() {
    let symbols_chosen = 0;
    for (let symbol of document.getElementsByName("symbols")){
        if (symbol.checked === true){
            symbols_chosen = 1;
            break;
        }
    }
     document.getElementById("sym").disabled = symbols_chosen === 0;
}

// select the first non-disabled option
function changeDefaultSelection() {
    let options = document.getElementsByName("beginning");
    let selected = Array.from(options).find(option => option.checked);
    if (selected !== undefined){
        if (selected.disabled === false){
            return
        }
    }

    for (let choice of document.getElementsByName("beginning")){
        if (choice.checked === true && choice.disabled === false){
            break;
        } else if (choice.checked === false && choice.disabled === false) {
            choice.checked = true;
            break;
        }
    }
}

// displays error message if password cannot be generated from the user's choices
function error(){
    let cases = document.getElementsByName("letters");
    let selected = Array.from(cases).find(let_case => let_case.checked);

    let digits = document.getElementsByName("digits");
    let dig_bool = Array.from(digits).find(option => option.checked);

    let symbols = document.getElementsByName("symbols");
    let sym = Array.from(symbols).find(s => s.checked);

    let error_field = document.getElementById("error");
    let submit_button =  document.querySelector("button");
    if (selected.value === "none" && dig_bool.value === "false" && sym === undefined  ) {
        error_field.hidden = false;
        submit_button.disabled = true;
    } else {
        error_field.hidden = true;
        submit_button.disabled = false;
    }

    let num_char = document.getElementById("num-characters");
    document.getElementById("another-error").hidden = num_char !== undefined;
}

// deletes old password
function clearPassword() {
    document.getElementById("password").innerText = "";
}

// copies the password to the clipboard
function copyPassword() {
    deleteCopyMessage();
    let password = document.getElementById("password");
    if (password.hidden === false && password.innerText !== ""){
        navigator.clipboard.writeText(document.getElementById("password").innerText);
        let new_p = document.createElement("p");
        new_p.id = "copyMessage";
        new_p.textContent = "Password copied to clipboard!";
        new_p.classList.add("block");
        document.getElementById("content-divider").appendChild(new_p);
    } else {
        let new_p = document.createElement("p");
        new_p.id = "copyMessage";
        new_p.textContent = "Nothing to copy";
        new_p.classList.add("block");
        document.getElementById("content-divider").appendChild(new_p);
    }
}

// deletes the copied password message
function deleteCopyMessage() {
    let copyMessage = document.getElementById("copyMessage");
    if (copyMessage !== null && copyMessage.innerText !== "") {
        document.getElementById("content-divider").removeChild(document.getElementById("copyMessage"))
    }
}

disableLetters();
disableDigits();
disableSymbol();
changeDefaultSelection();
error();

document.getElementById("case-choice").addEventListener("change", disableLetters);
document.getElementById("digits-boolean").addEventListener("change", disableDigits);
document.getElementById("symbol-choices").addEventListener("change", disableSymbol);

document.getElementById("case-choice").addEventListener("change", changeDefaultSelection);
document.getElementById("digits-boolean").addEventListener("change", changeDefaultSelection);
document.getElementById("symbol-choices").addEventListener("change", changeDefaultSelection);

document.getElementById("case-choice").addEventListener("change", error);
document.getElementById("digits-boolean").addEventListener("change", error);
document.getElementById("symbol-choices").addEventListener("change", error);
document.getElementById("num-characters").addEventListener("change", error);


document.getElementById("copy-button").addEventListener("click", copyPassword);

// form submission
form = document.getElementById("formInfo");
form.addEventListener("change", clearPassword);
form.addEventListener("submit", createPassword);
form.addEventListener("submit", deleteCopyMessage);
