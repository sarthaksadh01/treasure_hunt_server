function saveTeam() {
    $.ajax({
        url: "/submit",
        type: "POST",
        data: {
            teamName: $("#teamName").val(),
            teamLeader: $("#teamLeader").val(),
            members: $("#members").val(),
            contact: $("#contact").val()

        },
        success: function (response) {
            alert(response);
            if (response == "success") {
                $("#teamName").val("");
                $("#teamLeader").val("");
                $("#members").val("");
                $("#contact").val("");

            }

        }
    });
}