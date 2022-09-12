#!/bin/bash

echo "man man"
man man

# Создать файл
echo "123" > file.txt

echo "cat file.txt"
cat file.txt

# Добавить в конец файла
echo "echo \"321\" >> file.txt"
echo "321" >> file.txt

echo "cat file.txt"
cat file.txt

# Перемещение и переименование файлов
md box table
touch box/test1.txt
mv box/test1.txt table/
mv table/test1.txt table/test2.txt





