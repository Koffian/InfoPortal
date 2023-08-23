/** Перечеисление возможных типов публикации (по объёму) */
export const PostTypes = {
     Article:  0,   ///< Статья
     News:     1    ///< Новость
}


/** Перечеисление возможных форматов публикации (по содержимому) */
export const PostFormats = {
     Interview: 0,
     Reportage: 1,
     Case: 2,
     Review: 3,
     Opinion: 4,
     Digest: 5,
     Tutorial: 6,
     Roadmap: 7,
     FAQ: 8,
     Retrospective: 9,
     Analitics: 10
}

/** Перечеисление элементов, формирующих тело поста */
export const ContentTypes = {
	Header: 0,          ///< Заголовок
	Quote: 1,           ///< Цитата
	MarkedList: 2,      ///< Маркированный список
	NumberedList: 3,    ///< Нумерованный список
     MediaElement: 4,    ///< Медиалемент (вставка с внешиних ресурсов, )
     Image: 5,           ///< Изображение/gif с вашего устройства.
     Separator: 6,       ///< Разделитель
     Code: 7,            ///< Блок кода
     Formula: 8,         ///< Формула
     Spoiler: 9,         ///< Спойлер

     // Собственные типы
     Paragraph: 10       ///< Параграф
}

/**
 * Перечень элементов:

    Заголовок. Размер заголовка можно поменять в меню настроек блока (троеточие справа).

    Для задания размера заголовка можно использовать markdown-разметку: # , ## или ###. 

    Цитата. Вставляет блок с вертикальной чертой слева.

    В markdown за это отвечает символ >.

    Маркированный список. Может быть разных уровней вложенности.

    Можно использовать маркдаун (элементы списка символами «-», «+» или «*», а также хоткей ⌘/CTRL + Shift + 8.

    Нумерованный список. Строки с цифрой в начале автоматически преобразуются в нумерованный список, а для уже написанных строк можно нажать ⌘/CTRL + Shift + 7.

    Медиаэлемент. Пункт для вставки в статью информации с внешних ресурсов: твиты, записи из соцсетей, ролики с YouTube, сниппеты с Codepen и т. д.

    Изображение. Загрузка картинок с вашего устройства. Из настроек — можно расположить по левому краю, добавить рамку или подпись.

    Разделитель. Выровненная по центру полоска, можно использовать для отделения одного раздела от другого.

    Таблица. По умолчанию вставляется таблица 3х3, но можно добавлять как строки, так и столбцы — соответствующие кнопки появятся при нажатии на таблицу. Главное не переусердствовать: всего-всего уместить в таблицу не получится, поэтому следите за тем, чтобы содержимое таблицы было удобно считывать пользователям разных устройств. Ячейки таблицы можно объединять/разделять, а их содержимое — расположить по центру или правому/левому краю.

    Код. Вставка блока с кодом, который будет обрамлён в рамку, а строки будут пронумерованы. Опционально можно выбрать язык для подсветки синтаксиса.

    Аналог в маркдауне — тройные кавычки, ```код```.

    Для вставки не блока кода, а строчки, используйте одинарные кавычки, `код`.

    Формула. Ввод математических формул в Tex-формате. 

    Спойлер. Вставка разворачиваемого блока, внутри которого обычно прячут какую-то дополнительную информацию (текст, ссылки, длинный код) — для вставки доступны все перечисленные выше элементы. Опционально можно задать заголовок спойлера. 

    Якорь. Элемент, который может быть полезен для составления оглавления. Вставьте якорь в нужном месте публикации и присвойте ему имя, а в другом месте сделайте ссылку на него.
 */