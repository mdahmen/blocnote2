<?php
$noteId = 0;
?>@extends('master')
@section('title', 'Note editor')

@section('header')
    @parent
    <script type="text/javascript" src="{{asset("js/tinymce/jquery.tinymce.min.js")}}"></script>
    <script type="text/javascript" src="{{asset("js/tinymce/tinymce.min.js") }}"></script>


@stop

@@section('sidebar')
    @parent


@stop
@section('content')
    <?php
    /**
     * Created by PhpStorm.
     * User: manue
     * Date: 23/08/2015
     * Time: 18:33
     */

    $user = Auth::user()->email;

    if (!isset($folderId) || $folderId == 0) {
        $folderId = getRootForUser($user);
    }

    ?>
    @include("note/menu", ["noteId", 0])
    <form action="{{asset("note/save/txt/0") }}" method="GET" name="editor_form">
        <table>
            <tr>
                <td></td>
                <td><input type="hidden" name="noteId" value="0"/>
            <tr>
                <td></td>
                <td><input type="hidden" name="mime" value="text/plain"/>
            <tr>
                <td><label for="folder_id">Dossier</label></td>
                <td>
                    <?php
                    folder_field($folderId, "folder_id", $user);  ?></td>
            </tr>
            <tr>
                <td><label for="text_editor">Editer la note</label></td>
                <td><textarea rows="24" cols="80" name="content_file"
                              id="text_editor">
            <?php
                        echo "<p>" . gmdate("d/m/Y H:i:s", time()) . "</p>" . "<p>" . $user . "</p>";
                        ?></textarea></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="submit" name="sauvegarder" value="Sauvergarder" class="button btn btn-primary btn-success bg-success"/></td>
            </tr>
        </table>
    </form>
    @include('file/uploadform_frag', ["folderId" => $folderId])

@stop