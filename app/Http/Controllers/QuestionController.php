<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\Question;

class QuestionController extends Controller
{

    /**
     * Shows all questions.
     *
     * @return Response
     */
    public function home($question_id)
    {
      if (!Auth::check()) return redirect('/login');
      //$this->authorize('list', Question::class);
      $question = Question::find($question_id);
      return view('pages.question', ['question' => $question]);
    }

}