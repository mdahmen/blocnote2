@extends('master')
@section('title', 'Note browser')

@section('sidebar')
    @parent
    @include("menu", ["noteId", $noteId])


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
require_once(realpath(base_path("lib/bloc-notes2/composant/browser/listesItem.php")));
listerNotesFromDB("%%", FALSE, $noteId, Auth::user()->email);
*/

require_once(realpath(base_path("main_functions.php")));

listerNotesFromDB("%%", FALSE, $noteId, Auth::user()->email);

?>

    @stop
