import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './state.model';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class StateService {
  private readonly blacklist = new Set<string>();
  constructor(
    @InjectModel('signup') private readonly stateModel: Model<Test>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService

  ) {}

  // StateService
async insertState(
  name: string,
  email: string,
  password: string,
) {
  try {
    const existingUser = await this.stateModel.findOne({ email }).exec();
    if (existingUser) {
      return { status: 400, message: 'User with this email already exists', error: null };
    }

    if (password.length < 6) {
      return { status: 400, message: 'Password must be at least 6 characters long', error: null };
    }

    const newState = new this.stateModel({
      name,
      email,
      password,
    });
    const result = await newState.save();
    return { status: 200, message: 'State added successfully', data: { id: result.id } };
  } catch (error) {
    return { status: 500, message: 'Internal server error', error: error.message };
  }
}

// StateService
async validateUser(email: string, password: string) {
  try {
    const user = await this.stateModel.findOne({ email }).exec();

    if (user && user.password === password) {
      // You may want to replace the password comparison with a secure method like bcrypt
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);

      return {
        status: 200,
        message: 'Login successful',
        data: {
          accessToken,
        },
      };
    } else {
      return {
        status: 401,
        message: 'Invalid credentials',
        data: null,
      };
    }
  } catch (error) {
    return { status: 500, message: 'Internal server error', error: error.message };
  }
}

getRandomJoke(): Observable<any> {
  return this.httpService.get('https://api.chucknorris.io/jokes/random').pipe(
    map(response => {
      const { categories, created_at, icon_url, id, updated_at, url, value } = response.data;
      return {
        categories,
        created_at,
        icon_url,
        id,
        updated_at,
        url,
        value,
      };
    }),
  );
}
async logout(token: string): Promise<{ status: number; message: string }> {
  try {
    if (this.blacklist.has(token)) {
      return { status: 401, message: 'Token has already been invalidated' };
    }
    this.blacklist.add(token);
    return { status: 200, message: 'Logout successful' };
  } catch (error) {
    return { status: 500, message: 'Internal server error' };
  }
}
async getProfile(token: string): Promise<{ status: number; message: string; data?: any }> {
  try {
    const decodedToken = this.jwtService.decode(token) as { email: string; sub: string };
    
    if (!decodedToken || !decodedToken.email || !decodedToken.sub) {
      return { status: 401, message: 'Invalid token' };
    }

    const user = await this.stateModel.findById(decodedToken.sub).exec();

    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    return {
      status: 200,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        // Add other user details as needed
      },
    };
  } catch (error) {
    return { status: 500, message: 'Internal server error' };
  }
}
}