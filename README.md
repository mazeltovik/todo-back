## Установка
Первое, склонировать репозиторий с backend частью:
- [https://github.com/mazeltovik/todo-back](https://github.com/mazeltovik/https://github.com/mazeltovik/todo-back)
- перейти на ветку develop
- выполнить установку зависимостей командой:
 ```bash
$ npm install
```
- запустить локальный сервер:
```bash
$ npm run dev
```
```bash
Сервер прослушивает порт: 3000
```
```bash
Конечная точка для CRUD-операций - http://localhost:3000/tasks
```
```bash
Для разработки использовалась локальная база данных Mongo, которая запускалась как контейнер, при помощи docker.
Для проверки задания необходимо скачать данную базу данных с docker hub и запустить локально.
Ссылка для скачивания: https://hub.docker.com/_/mongo
```

