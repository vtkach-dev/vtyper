function choice(string, quantity) {
    let result = [];

    // В самой последней ноде на win 7 (v13.14.0) string читается неправильно, поэтому
    // создано ветвление ниже
    if (string.split('\r\n').length == 1) {
        string = string.split('\n')
    } else {
        string = string.split('\r\n');
    }

    for (let i = 0; i < quantity; i++) {
        result.push(
            string[Math.round(Math.random() * string.length)]
        )
    }

    return result//.join(' ');
}

export default choice;
