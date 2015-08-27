@extends('master')
@section('title', 'Note viewer')

@section('sidebar')
    @parent


@stop

@section('content')
    <?php
    /**
     * Created by PhpStorm.
     * User: manue_001
     * Date: 20-08-15
     * Time: 13:42
     */
    /*
        require_once(realpath(base_path("public/lib/bloc-notes/composant/browser/listesItem.php")));

        $mime = getMimeType($noteId);
        if(strpos($mime, "image") === 0)
        {
        ?><img src="{{ asset("file/view/".$noteId) }}"/><?php
    }
    else if(strchr($mime, "text") >= 0)
    {
    ?>{{ file_get_contents(asset("file/view/".$noteId)) }}<?php
    } else if ($mime == "directory") {
        echo "Répertoire";

    }*/
    ?>
    <div id="note_viewer_container" onclick="updateJoint();" style="padding: 20px; border: 3px groove #24a199">

    </div>

    <div id="lien_liste" onclick="updateJoint();" style="padding: 20px; border: 3px groove #24a199">

    </div>
    <script type="application/javascript">
        function updateJoint() {
            $.ajax({
                url: "{{asset("note/joint/list/$noteId") }}",

                context: document.body
            }).done(function (server_response) {
                $("#lien_liste").html(server_response);
            });
        }
        var type_html_start = "errors";
        var text_to_load = "";
        var type_viewed = "unknown";
        function updateNote() {

            $.get("{{asset("file/mime-type/$noteId")}}",

                    function (server_response) {
                        if (server_response.search("image") > -1) {
                            type_html_start = "<img src='{{ asset("file/view/".$noteId) }}''/>";
                        }
                        else if (server_response.search("text") > -1) {
                            type_html_start = "{{ asset("file/view/".$noteId) }}";
                            type_viewed = "text";
                        } else if (server_response.equals("directory")) {
                            type_html_start = "Repertoire";

                        }
                        $("#note_viewer_container").html(type_html_start);

                    });
            document.write("<h1>" + type_viewed + "</h1>");
            if (type_viewed.equals("text")) {
                $("#note_viewer_container").html("Load text ...");
                $.get(type_html_start,
                        function (server_response) {
                            $("#note_viewer_container").html(server_response);
                        });
            }
        }

        updateNote();
        updateJoint();
    </script>
    <a href="{{asset("note/joint/list/$noteId")}}">Liens </a>
@stop
