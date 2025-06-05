<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Para el jwt

class User extends Authenticatable implements JWTSubject // Se implementa el jwt
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'verification_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Métodos requeridos por JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }


    //Tiene muchas carpetas/notas/contraseñas
    
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }


    public function passwords()
    {
        return $this->hasMany(Password::class);
    }
}
