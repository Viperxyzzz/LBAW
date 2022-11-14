@extends('layouts.app')

@section('content')
<div class="container w-100 mx-0">
    <div class="row">
        @include('partials.feed.left_nav')
        <div class="col-sm-8">
            <div class="flex align-content-between mt-5">
                <a class="button float-right" href="#">Ask a question</a>
                <h2>Leading Questions</h2>
            </div>
            @foreach ($questions as $question)
                @include('partials.feed.question_card', ['question' => $question])
            @endforeach
        </div>
    </div>
</div>
@endsection
