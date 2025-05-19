<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Password extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'login', 'encrypted_password', 'url', 'user_id', 'folder_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }
}
