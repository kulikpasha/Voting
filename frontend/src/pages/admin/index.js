
//delete
$(document).on('click', '.delete', function() {
    $('.chsn').css({opacity: 0});
    setTimeout(function() {
        $('.chsn').remove()
    }, 500)
});

//chooseFunction

setTimeout(function() {
    $(document).ready(function() {
        $(document).on('click', '.highlight', choosePoll)
})}, 500);

function choosePoll() {
    $(`#pollId${this.id}`).toggleClass('choosen')
    $(`#upperPollId${this.id}`).toggleClass('chsn')
}


//render
$(document).on('click', '.render', function() {
    const button = $(this); // кнопка, по которой кликнули
    const buttonText = button.text().trim();
    

    if (buttonText === 'Редактировать') {
        const poll = this.closest('.poll')
        const save = poll.querySelector('.highlight')
        $('.upperPoll').css('z-index', -1)
        $('.newPoll').css('z-index', -1)
        $(`#upperPollId${this.id}`).css('z-index', 1)
        document.querySelector(`#upperPollId${this.id}`).classList.add('move')
        button.text('Отмена')
        save.textContent = 'Сохранить'
        save.classList.add('save')
        save.classList.remove('highlight')
        $(`#adminPanelId${this.id}`).addClass('active_panel')
        if (document.getElementById(`pollId${this.id}`).classList.contains('choosen')){
            $(`#pollId${this.id}`).toggleClass('choosen')
        }
    } else {
        const poll = this.closest('.poll')
        const save = poll.querySelector('.save')
        $(`#adminPanelId${this.id}`).removeClass('active_panel')
        document.querySelector(`#upperPollId${this.id}`).classList.remove('move')
        $('.upperPoll').css('z-index', 1)
        $('.newPoll').css('z-index', 1)
        button.text('Редактировать')
        save.textContent = 'Выделить'
        $('.save').addClass('highlight')
        $('.highlight').removeClass('save')
    }
})

//scroll