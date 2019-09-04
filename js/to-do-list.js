window.ToDoList = {
    API_BASE_URL: "http://localhost:8083/to-do-items",

    createItem: function () {
        var description = $("#description-field").val();
        var deadline = $("#deadline-picker").val();

        var item = {
            description: description,
            deadline: deadline
        };

        $.ajax({
            url: ToDoList.API_BASE_URL,
            method: "POST",
            // MIME type
            contentType: "application/json",
            data: JSON.stringify(item)
        }).done(function (response) {
            ToDoList.getItems();
        })
    },

    getItems: function () {
        $.ajax({
            url: ToDoList.API_BASE_URL,
            method: "GET",
        }).done(function (response) {
            console.log("Successfully received response");
            console.log(response);

            ToDoList.displayItems(JSON.parse(response));
        })
    },

    deleteItem: function (itemId) {
        $.ajax({
            url: ToDoList.API_BASE_URL + "?id=" + itemId,
            method: "DELETE"
        }).done(function (response) {
            ToDoList.getItems();
        })
    },

    updateItem: function (itemId, done) {
        $.ajax({
            url: ToDoList.API_BASE_URL + "?id=" + itemId,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                done: done
            })
        }).done(function (response) {
            ToDoList.getItems();
        })
    },

    displayItems: function (items) {
        var tableBodyHtml = '';

        items.forEach(item => tableBodyHtml += ToDoList.getItemRow(item));

        $('#to-do-items-table tbody').html(tableBodyHtml);
    },

    getItemRow: function (item) {
        var formattedDate = new Date(...item.deadline).toLocaleDateString("en-US");

        // ternary operator
        var checkedAttribute = item.done ? "checked" : "";

        return `<tr>
                <td>${item.description}</td>
                <td>${formattedDate}</td>
                <td><input type="checkbox" class="mark-done-checkbox" 
                title="Completed" data-id="${item.id}" ${checkedAttribute}/></td>
                
                <td><a href="#" class="delete-item fa fa-trash" data-id="${item.id}"></a></td>
            </tr>`
    },

    bindEvents: function () {

        $('#new-item-form').submit(function (event) {
            event.preventDefault();

            ToDoList.createItem();
        });

        // using delegate because the element a.delete-item is dynamically injected
        // after the page has been loaded
        $('#to-do-items-table').delegate('.delete-item', 'click', function (event) {
            event.preventDefault();

            var itemId = $(this).data('id');

            ToDoList.deleteItem(itemId);
        });

        $('#to-do-items-table').delegate('.mark-done-checkbox', 'change',
            function (event) {
                event.preventDefault();

                var itemId = $(this).data('id');
                var checkboxChecked = $(this).is(':checked');

                ToDoList.updateItem(itemId, checkboxChecked);
            });
    }
};

ToDoList.getItems();
ToDoList.bindEvents();
