<div class="col-lg-8">
    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-sm-3">
                <p class="mb-0">Username</p>
                </div>
                <div class="col-sm-9">
                <p class="text-muted mb-0">{{$user->username}}</p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                <p class="text-muted mb-0">{{$user->name}}</p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm-3">
                <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                <p class="text-muted mb-0">{{$user->email}}</p>
                </div>
            </div>
        </div>
    </div>
</div>

<button class="ml-4" onclick="editPass()">Edit Password</button>