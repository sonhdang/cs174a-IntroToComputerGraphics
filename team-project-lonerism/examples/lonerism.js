import {tiny, defs} from './common.js';

// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere } = defs;


export class Scenery extends Scene {
    constructor(){
        super();

        this.scenery_shapes = { donut  : new defs.Torus          ( 15, 15, [[0,2],[0,1]] ),
                        cone   : new defs.Closed_Cone    ( 4, 10,  [[0,2],[0,1]] ),
                        capped : new defs.Capped_Cylinder( 4, 12,  [[0,2],[0,1]] ),
                        prism  : new ( defs.Capped_Cylinder   .prototype.make_flat_shaded_version() )( 10, 10, [[0,2],[0,1]] ),
                        gem    : new ( defs.Subdivision_Sphere.prototype.make_flat_shaded_version() )( 2 ),
                        donut2 : new ( defs.Torus             .prototype.make_flat_shaded_version() )( 20, 20, [[0,2],[0,1]] ), 
                        square : new Square()
                    };
        
        const textured = new defs.Textured_Phong( 1 );
        this.scenery_materials = 
        {

            stars : new Material( textured,
                { ambient:1, texture: new Texture( "assets/stars.png" ) } ),
            ground: new Material( textured, 
                { ambient: 1, texture: new Texture( "assets/grass.png" ) } ),
            sky: new Material( textured, 
                {ambient: 1, texture: new Texture("assets/sky.jpeg") } )  };

        
        this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });



    }
    draw_environment(context, graphics_state){
        const t = this.t = graphics_state.animation_time / 1000;

        // display sky 
        let model_transform = Mat4.identity().times( Mat4.scale(50,50,50));
        this.shapes.box.draw(context, graphics_state, model_transform, this.scenery_materials.sky );

        // display ground
        this.scenery_shapes.square.draw(context, graphics_state, Mat4.translation( 0,-3.0,0 )
                                       .times( Mat4.rotation( Math.PI/2,   1,0,0 ) ).times( Mat4.scale( 50,50,1 ) ), 
                                                    this.scenery_materials.ground);


    }
    
    draw_advanced_feature(context, graphics_state)
    {
        
        
    }

    display(context, graphics_state){
        this.draw_environment(context,graphics_state);

        // Advance feature: Bump Mapping 
        this.draw_advanced_feature(context, graphics_state);

    }
    
} 

export class Lonerism extends Scenery
{
    constructor()
    {
        super();
        this.shapes = {'box' : new Cube(),
        'ball' : new Subdivision_Sphere( 4 )};
        const phong = new defs.Phong_Shader();
        this.materials = { plastic: new Material( phong,
                { ambient: .2, diffusivity: 1, specularity: .5, color: color( .9,.5,.9,1 ) } ),
                           metal: new Material( phong,
                { ambient: .2, diffusivity: 1, specularity:  1, color: color( .9,.5,.9,1 ) } ),
            colorRed: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color1.png" ) } ),
            colorWhite: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color2.png" ) } ),
            colorGreen: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color3.png" ) } ),
            colorYellow: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color4.png" ) } ),
            colorPink: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color5.png" ) } ),
            colorBlue: new Material( phong, 
                { ambient: 1, texture: new Texture( "assets/color6.png" ) } ) };

        this.busy = false;
        this.direction = true;
        this.rotating_front = this.rotating_back = this.rotating_top =
            this.rotating_bot = this.rotating_left = this. rotating_right = Math.PI / 2;
        this.rotation_finish_front = this.rotation_finish_back = this.rotation_finish_top =
            this.rotation_finish_bot = this.rotation_finish_left = this.rotation_finish_right = true;
        this.speed = Math.PI * 0.01;
        this.shuffle = false;
        this.solved = false;
        this.kat = 0;
        this.resul = 0;
        this.cubes = Array(8).fill(Mat4.identity());
        this.cubes_color = Array(24).fill(color( 0,0,1,1 ));
        this.initialize();
        let solutionCubeState = [
          Array(4).fill(this.materials.colorRed),
          Array(4).fill(this.materials.colorWhite),
          Array(4).fill(this.materials.colorGreen),
          Array(4).fill(this.materials.colorYellow),
          Array(4).fill(this.materials.colorPink),
          Array(4).fill(this.materials.colorBlue),
        ];
        var stateMapping = {
          0: {
                0: [1, 1],
                1: [0 ,2],
                2: null,
                3: null,      
                4: null,
                5: [5, 1],
          },
          1: {
                0: [1, 2],
                1: null,
                2: null,
                3: null,      
                4: [4, 3],
                5: [5, 0],
          },
          2: {
                0: [2, 3],
                1: [0, 0],
                2: [2, 3],
                3: null,      
                4: null,
                5: null,
          },
          3: {
                0: [1, 0],
                1: null,
                2: [2, 2],
                3: null,      
                4: [4, 1],
                5: null,
          },
          4: {
                0: null,
                1: [0, 3],
                2: null,
                3: [3, 2],      
                4: null,
                5: [5, 3],
          },
          5: {
                0: null,
                1: null,
                2: null,
                3: [3, 2],      
                4: [4, 2],
                5: [5, 2],
          },
          6: {
                0: null,
                1: [0, 1],
                2: [2, 1],
                3: [5, 1],      
                4: null,
                5: null,
          },
          7: {
                0: null,
                1: null,
                2: [2, 0],
                3: [3, 0],      
                4: [4, 0],
                5: null,
          }
         
        }
        

    }

    make_control_panel()
    {
        this.key_triggered_button("Front", [ "x" ], () => {
            this.rotating_front = 0;
            this.direction = true;
            this.rotation_finish_front = false;
            } );
        this.key_triggered_button("Front Inverse", ["c"], () => {
            this.rotating_front= 0;
            this.direction = false;
            this.rotation_finish_front = false;
            } ); this.new_line();
        this.key_triggered_button("Back", [ "v" ], () => {
            this.rotating_back = 0;
            this.direction = true;
            this.rotation_finish_back = false;
        } );
        this.key_triggered_button("Back Inverse", ["b"], () => {
            this.rotating_back = 0;
            this.direction = false;
            this.rotation_finish_back = false;
        } ); this.new_line();
        this.key_triggered_button("Top", [ "n" ], () => {
            this.rotating_top = 0;
            this.direction = true;
            this.rotation_finish_top = false;
        } );
        this.key_triggered_button("Top Inverse", ["m"], () => {
            this.rotating_top = 0;
            this.direction = false;
            this.rotation_finish_top = false;
        } );
        this.new_line();
        this.key_triggered_button("Bottom", [ "g" ], () => {
            this.rotating_bot = 0;
            this.direction = true;
            this.rotation_finish_bot = false;
        } );
        this.key_triggered_button("Bottom Inverse", ["h"], () => {
            this.rotating_bot = 0;
            this.direction = false;
            this.rotation_finish_bot = false;
        } );
        this.new_line();
        this.key_triggered_button("Left", [ "j" ], () => {
            this.rotating_left = 0;
            this.direction = true;
            this.rotation_finish_left = false;
        } );
        this.key_triggered_button("Left Inverse", ["k"], () => {
            this.rotating_left = 0;
            this.direction = false;
            this.rotation_finish_left = false;
        } );
        this.new_line();
        this.key_triggered_button("Right", [ "l" ], () => {
            this.rotating_right = 0;
            this.direction = true;
            this.rotation_finish_right = false;
        } );
        this.key_triggered_button("Right Inverse", ["p"], () => {
            this.rotating_right = 0;
            this.direction = false;
            this.rotation_finish_right = false;
        } );
        this.new_line();
        this.key_triggered_button("RandomTurn", [ "u" ], () => this.shuffle = !this.shuffle);
        this.key_triggered_button("Solve", ["y"], () => this.solved = !this.solved ); this.new_line();
        this.key_triggered_button("Reset", [ "t" ], () => {
            this.cubes_color[0] = color(1,1,0,1);
            this.cubes_color[1] = color(0,0,1,1);
            this.cubes_color[2] = color(0,0,1,1);
            this.cubes_color[3] = color(1,1,0,1);
            this.cubes_color[4] = color(0,0,1,1);
            this.cubes_color[5] = color(1,1,0,1);
            this.cubes_color[6] = color(1,1,0,1);
            this.cubes_color[7] = color(0,0,1,1);


        } );
    }

    initialize()
    {
        this.cubes[0] = this.cubes[0].times( Mat4. translation(1.05, -1.05, 0));
        this.cubes_color[0] = color(1,1,0,1);
        this.cubes[1] = this.cubes[1].times( Mat4. translation(-1.05, -1.05, 0));
        this.cubes_color[1] = color(0,0,1,1);
        this.cubes[2] = this.cubes[2].times( Mat4. translation(1.05, 1.05, 0));
        this.cubes_color[2] = color(0,0,1,1);
        this.cubes[3] = this.cubes[3].times( Mat4. translation(-1.05, 1.05, 0));
        this.cubes_color[3] = color(1,1,0,1);
        this.cubes[4] = this.cubes[4].times( Mat4. translation(1.05, -1.05, -2.1));
        this.cubes_color[4] = color(0,0,1,1);
        this.cubes[5] = this.cubes[5].times( Mat4. translation(-1.05, -1.05, -2.1));
        this.cubes_color[5] = color(1,1,0,1);
        this.cubes[6] = this.cubes[6].times( Mat4. translation(1.05, 1.05, -2.1));
        this.cubes_color[6] = color(1,1,0,1);
        this.cubes[7] = this.cubes[7].times( Mat4. translation(-1.05, 1.05, -2.1));
        this.cubes_color[7] = color(0,0,1,1);
    }

    rotate_front( direction )
    {
        if (direction)  // true for rotating the front clockwise, false for counter-clockwise
        {
            for (let i = 0; i < 4; i ++)
            {
                this.cubes[i] = Mat4.rotation(-this.speed, 0, 0, 1).times(this.cubes[i]);
            }
        }
        else {
            for (let i = 0; i < 4; i++) {
                this.cubes[i] = Mat4.rotation(+this.speed, 0, 0, 1).times(this.cubes[i]);
            }
        }

    }

    rotate_back( direction )
    {
        if (direction)  // true for rotating the back clockwise, false for counter-clockwise
        {
            for (let i = 4; i < 8; i ++)
            {
                this.cubes[i] = Mat4.rotation(-this.speed, 0, 0, 1).times(this.cubes[i]);
            }
        }
        else {
            for (let i = 4; i < 8; i++) {
                this.cubes[i] = Mat4.rotation(this.speed, 0, 0, 1).times(this.cubes[i]);
            }
        }

    }

    rotate_top( direction )
    {
        if (direction)  // true for rotating the front clockwise, false for counter-clockwise
        {
            this.cubes[2] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[2]);
            this.cubes[3] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[3]);
            this.cubes[7] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[7]);
            this.cubes[6] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[6]);
        }
        else {
            this.cubes[2] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[2]);
            this.cubes[3] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[3]);
            this.cubes[7] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[7]);
            this.cubes[6] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[6]);
        }


    }

    rotate_bot( direction )
    {
        if (direction)  // true for rotating the front clockwise, false for counter-clockwise
        {
            this.cubes[0] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[0]);
            this.cubes[1] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[1]);
            this.cubes[5] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[5]);
            this.cubes[4] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[4]);
        }
        else {
            this.cubes[0] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[0]);
            this.cubes[1] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[1]);
            this.cubes[5] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[5]);
            this.cubes[4] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 0, 1, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[4]);
        }


    }

    rotate_left( direction)
    {
        if (direction)  // true for rotating the back clockwise, false for counter-clockwise
        {
            this.cubes[5] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[5]);
            this.cubes[1] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[1]);
            this.cubes[3] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[3]);
            this.cubes[7] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[7]);
        }
        else {
            this.cubes[5] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[5]);
            this.cubes[1] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[1]);
            this.cubes[3] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[3]);
            this.cubes[7] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[7]);
        }
    }

    rotate_right( direction )
    {
        if (direction)  // true for rotating the back clockwise, false for counter-clockwise
        {
            this.cubes[0] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[0]);
            this.cubes[4] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[4]);
            this.cubes[6] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[6]);
            this.cubes[2] = Mat4.translation(0, 0, -1).times(Mat4.rotation(-this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[2]);
        }
        else {
            this.cubes[0] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[0]);
            this.cubes[4] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[4]);
            this.cubes[6] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[6]);
            this.cubes[2] = Mat4.translation(0, 0, -1).times(Mat4.rotation(this.speed, 1, 0, 0)).times(Mat4.translation(0, 0, 1)).times(this.cubes[2]);
        }
    }

    
    display( context, graphics_state )
    {
        if( !context.scratchpad.controls )
        { 
            this.children.push( context.scratchpad.controls = new defs.Movement_Controls() );
            graphics_state.set_camera( Mat4.translation( 1,-3,-15 ).times( Mat4.rotation(Math.PI/24 , 0,0,1) )
                                                                   .times( Mat4.rotation(Math.PI/4 , 0,1,0) )
                                                                   .times( Mat4.rotation(Math.PI/16 , 1,0,0) ) );
        }
        graphics_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 100 );
        const t = this.t = graphics_state.animation_time/1000;

        graphics_state.lights = [ new Light( vec4(-1,1.5,2,0),  color( 1,1,1,1 ), 100000 ) ];

                                                        //  Call the setup code that we left inside the scenery class:
        super.display( context, graphics_state );

        let cubes = Array (8).fill(Mat4.identity());    // Model Transform of 8 individual cubes
        const blue = color( 0,0,1,1 ), yellow = color( 1,1,0,1 );

        let rotation = Mat4.rotation(0, 0, 0, 1);
        if (this.solved){
            this.resul = this.resul +1;
            var e = this.resul % 4;
            if (e == 1){
               this.rotating_right= 0;
               this.direction = true;
            }
            else if(e == 2){
               this.rotating_top = 0;
               this.direction = true;
            }
            else if(e == 3){
               this.rotating_left = 0;
               this.direction = true;
            }
            else{
                this.rotating_bot = 0;
                this.direction = true;
            }
            this.solved=false;
        }
        if (this.shuffle){
                this.kat = this.kat +1;
                var k = this.kat%4;
                if (k == 0){
                    this.rotating_front = 0;
                    this.direction = true;
                }
                else if(k == 1){
                    this.rotating_top = 0;
                    this.direction = true;
                }
                else if(k == 2){
                    this.rotating_left = 0;
                    this.direction = true;
                }
                else{
                    this.rotating_right= 0;
                    this.direction = true;
                }

                this.rotation_cube();
                for (let i = 0; i < 8; i++)
                {
                    this.shapes.box.draw( context, graphics_state, this.cubes[i], this.materials.plastic.override(this.cubes_color[i]));
                }
            this.shuffle = false;

        }
        else{
            this.rotation_cube();
        for (let i = 0; i < 8; i++)
        {
//                            // draw the appropriate colors                                   
//             for( let i = 0; i < 3; i++ )        
//                 for( let j = 0; j < 2; j++ ) 
//                 {             // Find the matrix for a basis located along one of the cube's sides:
//                     let cube_side = Mat4.rotation( i == 0 ? Math.PI/2 : 0,   1, 0, 0 )
//                                 .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ),   0, 1, 0 ) )
//                                 .times( Mat4.translation( -.9, .9, 1.01 ) );

                    
//                         // Draw cubes_color for every side of our current cube
//                     this.shapes.box.draw( context, graphics_state, this.cubes[i], this.materials.plastic.override(this.cubes_color[i]));
//                 }
            this.shapes.box.draw( context, graphics_state, this.cubes[i], this.materials.plastic.override(this.cubes_color[i]));
        }
        }
    }
    rotation_cube(){
        if (this.rotating_front < Math.PI/2 || !this.rotation_finish_front )
        {
            this.rotate_front(this.direction);
            this.rotating_front += this.speed;
            if (this.rotating_front > Math.PI/2 && this.direction)
            {
                this.rotation_finish_front = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[2];
                this.cubes_color[0] = this.cubes_color[2];
                this.cubes[2] = this.cubes[3];
                this.cubes_color[2] = this.cubes_color[3];
                this.cubes[3] = this.cubes[1];
                this.cubes_color[3] = this.cubes_color[1];
                this.cubes[1] = temp;
                this.cubes_color[1] = temp_color;
            }
            else if(this.rotating_front > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_front = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[1];
                this.cubes_color[0] = this.cubes_color[1];
                this.cubes[1] = this.cubes[3];
                this.cubes_color[1] = this.cubes_color[3];
                this.cubes[3] = this.cubes[2];
                this.cubes_color[3] = this.cubes_color[2];
                this.cubes[2] = temp;
                this.cubes_color[2] = temp_color;
            }
        }


        if (this.rotating_back < Math.PI/2 || !this.rotation_finish_back )
        {
            this.rotate_back(this.direction);
            this.rotating_back += this.speed;
            if (this.rotating_back > Math.PI/2 && this.direction)
            {
                this.rotation_finish_back = true;
                let temp = this.cubes[4];
                let temp_color = this.cubes_color[4];
                this.cubes[4] = this.cubes[6];
                this.cubes_color[4] = this.cubes_color[6];
                this.cubes[6] = this.cubes[7];
                this.cubes_color[6] = this.cubes_color[7];
                this.cubes[7] = this.cubes[5];
                this.cubes_color[7] = this.cubes_color[5];
                this.cubes[5] = temp;
                this.cubes_color[5] = temp_color;
            }
            else if(this.rotating_back > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_back = true;
                let temp = this.cubes[4];
                let temp_color = this.cubes_color[4];
                this.cubes[4] = this.cubes[5];
                this.cubes_color[4] = this.cubes_color[5];
                this.cubes[5] = this.cubes[7];
                this.cubes_color[5] = this.cubes_color[7];
                this.cubes[7] = this.cubes[6];
                this.cubes_color[7] = this.cubes_color[6];
                this.cubes[6] = temp;
                this.cubes_color[6] = temp_color;
            }
        }

        if (this.rotating_top < Math.PI/2 )
        {
            this.rotate_top(this.direction);
            this.rotating_top += this.speed;
            if (this.rotating_top > Math.PI/2 && this.direction)
            {
                this.rotation_finish_top = true;
                let temp = this.cubes[2];
                let temp_color = this.cubes_color[2];
                this.cubes[2] = this.cubes[6];
                this.cubes_color[2] = this.cubes_color[6];
                this.cubes[6] = this.cubes[7];
                this.cubes_color[6] = this.cubes_color[7];
                this.cubes[7] = this.cubes[3];
                this.cubes_color[7] = this.cubes_color[3];
                this.cubes[3] = temp;
                this.cubes_color[3] = temp_color;
            }
            else if(this.rotating_top > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_top = true;
                let temp = this.cubes[2];
                let temp_color = this.cubes_color[2];
                this.cubes[2] = this.cubes[3];
                this.cubes_color[2] = this.cubes_color[3];
                this.cubes[3] = this.cubes[7];
                this.cubes_color[3] = this.cubes_color[7];
                this.cubes[7] = this.cubes[6];
                this.cubes_color[7] = this.cubes_color[6];
                this.cubes[6] = temp;
                this.cubes_color[6] = temp_color;
            }
        }

        if (this.rotating_bot < Math.PI/2 )
        {
            this.rotate_bot(this.direction);
            this.rotating_bot += this.speed;
            if (this.rotating_bot > Math.PI/2 && this.direction)
            {
                this.rotation_finish_bot = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[4];
                this.cubes_color[0] = this.cubes_color[4];
                this.cubes[4] = this.cubes[5];
                this.cubes_color[4] = this.cubes_color[5];
                this.cubes[5] = this.cubes[1];
                this.cubes_color[5] = this.cubes_color[1];
                this.cubes[1] = temp;
                this.cubes_color[1] = temp_color;
            }
            else if(this.rotating_bot > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_bot = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[1];
                this.cubes_color[0] = this.cubes_color[1];
                this.cubes[1] = this.cubes[5];
                this.cubes_color[1] = this.cubes_color[5];
                this.cubes[5] = this.cubes[4];
                this.cubes_color[5] = this.cubes_color[4];
                this.cubes[4] = temp;
                this.cubes_color[4] = temp_color;
            }
        }

        if (this.rotating_left < Math.PI/2 )
        {
            this.rotate_left(this.direction);
            this.rotating_left += this.speed;
            if (this.rotating_left > Math.PI/2 && this.direction)
            {
                this.rotation_finish_left = true;
                let temp = this.cubes[1];
                let temp_color = this.cubes_color[1];
                this.cubes[1] = this.cubes[3];
                this.cubes_color[1] = this.cubes_color[3];
                this.cubes[3] = this.cubes[7];
                this.cubes_color[3] = this.cubes_color[7];
                this.cubes[7] = this.cubes[5];
                this.cubes_color[7] = this.cubes_color[5];
                this.cubes[5] = temp;
                this.cubes_color[5] = temp_color;
            }
            else if(this.rotating_left > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_left = true;
                let temp = this.cubes[1];
                let temp_color = this.cubes_color[1];
                this.cubes[1] = this.cubes[5];
                this.cubes_color[1] = this.cubes_color[5];
                this.cubes[5] = this.cubes[7];
                this.cubes_color[5] = this.cubes_color[7];
                this.cubes[7] = this.cubes[3];
                this.cubes_color[7] = this.cubes_color[3];
                this.cubes[3] = temp;
                this.cubes_color[3] = temp_color;
            }
        }
        if (this.rotating_right < Math.PI/2 )
        {
            this.rotate_right(this.direction);
            this.rotating_right += this.speed;
            if (this.rotating_right > Math.PI/2 && this.direction)
            {
                this.rotation_finish_right = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[4];
                this.cubes_color[0] = this.cubes_color[4];
                this.cubes[4] = this.cubes[6];
                this.cubes_color[4] = this.cubes_color[6];
                this.cubes[6] = this.cubes[2];
                this.cubes_color[6] = this.cubes_color[2];
                this.cubes[2] = temp;
                this.cubes_color[2] = temp_color;
            }
            else if(this.rotating_right > Math.PI/2 && !this.direction)
            {
                this.rotation_finish_right = true;
                let temp = this.cubes[0];
                let temp_color = this.cubes_color[0];
                this.cubes[0] = this.cubes[2];
                this.cubes_color[0] = this.cubes_color[2];
                this.cubes[2] = this.cubes[6];
                this.cubes_color[2] = this.cubes_color[6];
                this.cubes[6] = this.cubes[4];
                this.cubes_color[6] = this.cubes_color[4];
                this.cubes[4] = temp;
                this.cubes_color[4] = temp_color;
            }
        }


    }
}