<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title'];

    // Relación: una carpeta pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Puede tener muchas notas
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // Puede tener muchas contraseñas
    public function passwords()
    {
        return $this->hasMany(Password::class);
    }
}
