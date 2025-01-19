import { Injectable, NotFoundException } from '@nestjs/common';
import { error } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';
import * as brcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prismaService : PrismaService,
    private jwtService: JwtService,

    ) {}


    async signUp(data: any){
        try { 

            const isExist = await this.prismaService.users.findUnique({
                where: {
                    email: data.email
                }
            })
            // llll
            console.log('asd',isExist)
            if(isExist){
                throw 'User already exists'
            } else{

                const newUser = await this.prismaService.users.create({
                    data: {
                        roleId: 1,
                        email : data.email, 
                        password: '', 
                        name : data.email, 
                        createdAt: new Date(), 
                        updatedAt: new Date()
                    }
                })
                
                console.log('adsf', newUser)

                const HashedPass = await brcrypt.hash(data.password, 10)

                if(HashedPass){
                  
                    await this.prismaService.users.update({
                        where: {
                            id: newUser.id
                        },
                        data: {
                            password: HashedPass,
                            createdAt: new Date()
                        }
                    })
                }


                
            }
            
            

            


        } catch (error) {
           console.log('error::', error)            
        }


    }

    async generateTokens(userId) {
        const token = await this.jwtService.sign(
          { userId },
          {
            secret: 'my-secret',
            expiresIn: '50m',
          },
        );
        const refreshToken = await this.jwtService.sign(
          { userId },
          {
            secret: 'my-secret',
            expiresIn: '60m',
          },
        );
        return { token, refreshToken };
    }
    
      async login(data: any) {
        try {
            const user = await this.prismaService.users.findUnique({
                where: {
                  email: data.email,
                }
              });
          
              console.log('user', user)
          
              if (!user) {
                throw new NotFoundException('User Not Found');
              }
              
              let matchPass = await brcrypt.compare(data.password, user.password) 
          
          
              if(matchPass){
          
                return await this.generateTokens(user.id);
          
              }else{
                throw new NotFoundException('Invalid Email or Password!')
              }
            

        } catch (error) {
            console.log('ewer',error)
        }
    
        
    
      }



}
