import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('sign-up')
    async signUp(@Body() body: any){
        try {

            const res = this.authService.signUp(body)
            console.log('asdfdd', res)

            
        } catch (error) {
            console.log('error::', error)
        }
    }

    @Post('log-in')
    async login(@Body() body: any){
        try {
 
            const res = await this.authService.login(body)

            return res

            
        } catch (error) {
            console.log('error',error)
        }
        
    }


}
