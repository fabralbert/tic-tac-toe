window.addEventListener('load', function () {
  const modalList = document.querySelectorAll('.modal__item')
  const cells = document.querySelectorAll('.cell')
  const modal = document.querySelector('.modal')
  const modalResult = document.querySelector('.modal_text-result')
  const modalTitle = document.querySelector('.modal__title')
  const firstStep = document.querySelector('.firstStep')
  const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  let userMoving
  let k = 0 // индекс для выбранной клетки
  let i = 0 // индекс для выбранного меню
  if (i == 0) {
    modalList[i].classList.add('modal_selected')
  }

  window.addEventListener('keydown', startGame)

  function startGame(event) {
    resetGame()
    switch (event.key) {
      case 'ArrowLeft':
        if (i == 1) {
          modalList[i].classList.remove('modal_selected')
          i--
          modalList[i].classList.add('modal_selected')
        }
        break
      case 'ArrowRight':
        if (i < 1) {
          modalList[i].classList.remove('modal_selected')
          i++
          modalList[i].classList.add('modal_selected')
        }
        break
      case 'Enter':
        const chosedMenu = modal.querySelector('.modal_selected')
        if (chosedMenu.textContent == 'ДА') {
          modal.classList.add('hidden')
          if (!userMoving) {
            firstStep.textContent = 'Первый ход: Компьютер'
            computerMove()
          } else {
            firstStep.textContent = 'Первый ход: Игрок'
            cells[k].classList.add('cell_selected')
          }
          window.addEventListener('keydown', userMove)
          window.removeEventListener('keydown', startGame)
        } else if (chosedMenu.textContent == 'НЕТ') {
          location.href = 'http://google.com'
        }
        break
    }
  }

  function randomFirstMove() {
    return Math.floor(Math.random() * 2)
  }

  function computerMove() {
    cells[k].classList.remove('cell_selected')
    const computerText = userMoving ? 'O' : 'X'
    const leftCells = []
    cells.forEach((cell, index) => {
      if (cell.textContent == '') {
        leftCells.push(index)
      }
    })
    if (leftCells.length) {
      let randomCell = leftCells[Math.floor(Math.random() * leftCells.length)]

      cells[randomCell].classList.add('cell_selected')
      cells[randomCell].textContent = computerText
      k = randomCell
    }
    gameOver(computerText, 'компьютером')
  }

  function userMove(event) {
    const userText = userMoving ? 'X' : 'O'

    switch (event.key) {
      case 'ArrowLeft':
        switchCells(k != 0 && k != 3 && k != 6, k - 1)
        break
      case 'ArrowRight':
        switchCells(k != 2 && k != 5 && k != 8, k + 1)
        break
      case 'ArrowUp':
        switchCells(k != 0 && k != 1 && k != 2, k - 3)
        break
      case 'ArrowDown':
        switchCells(k != 6 && k != 7 && k != 8, k + 3)
        break

      case 'Enter':
        if (cells[k].textContent == '') {
          cells[k].textContent = userText
          // cells[k].classList.remove('cell_selected')
          if (gameOver(userText, 'игроком')) return
          computerMove()
        }
        break
    }
  }

  // переключение клеток через стрелки
  function switchCells(condition, number) {
    if (condition) {
      cells[k].classList.remove('cell_selected')
      k = number
      cells[k].classList.add('cell_selected')
    }
  }

  function gameOver(text, resultText) {
    // проверка на победу
    if (
      WIN_COMBINATIONS.some((combination) => {
        return combination.every((item) => cells[item].textContent == text)
      })
    ) {
      gameResult(`Победа за ${resultText}`)
      return true
    } else if (
      // проверка на ничью

      [...cells].every((cell) => cell.textContent)
    ) {
      gameResult('Ничья!')
    }
  }

  // обнуляем все данные
  function resetGame() {
    k = 0
    cells.forEach((cell) => {
      cell.textContent = ''
      cell.classList.remove('cell_selected')
    })
    window.removeEventListener('keydown', userMove)
    userMoving = randomFirstMove()
  }

  // текст после чьей либо победы или ничьи
  function gameResult(textWinner) {
    modalTitle.textContent = 'Вы хотите сыграть еще?'
    modal.classList.remove('hidden')
    window.addEventListener('keydown', startGame)
    modalResult.textContent = textWinner
  }
})
