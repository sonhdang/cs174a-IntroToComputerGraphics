window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         sun: new Subdivision_Sphere(4),
                         planet_1: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(2),
                         planet_2: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(3),
                         planet_3: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(4),
                         planet_3_ring: new Torus( 15, 15 ),
                         planet_4: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(4),
                         moon: new(Subdivision_Sphere.prototype.make_flat_shaded_version() )(1),
                         test_sun: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(4)
 
                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            icy_gray: context.get_instance( Phong_Shader ).material( Color.of(0.4, 0.4, 0.7, 1), { diffusivity:1,
            specularity: 0}),
            muddy:    context.get_instance( Phong_Shader ).material( Color.of(0.65, 0.4, 0.3, 1),
                      { diffusivity: 1,
                      specularity: 1 }),
            soft_light_blue: context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0.6, 1),
                      { specularity: 0.8}),
            green_moon: context.get_instance( Phong_Shader ).material( Color.of(0, 0.4, 0.4, 1),)

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }
        this.attached = () => this.initial_camera_location;
        this.planet_1 = this.initial_camera_location;
        this.planet_2 = this.initial_camera_location;
        this.planet_3 = this.initial_camera_location;
        this.planet_4 = this.initial_camera_location;
        this.moon = this.initial_camera_location;

        this.context = context;
        this.is_view_solar = true;
        
        this.wobble_x = 0;
        this.wobble_x_direction = 0.01; // true means moving in the positive direction
        this.wobble_to_x = 0;
        this.wobble_y = 0;
        this.wobble_y_direction = 0.01; // true means moving in the positive direction
        this.wobble_to_y = 0;
        this.wobble_z = 0;
        this.wobble_z_direction = 0.01; // true means moving in the positive direction
        this.wobble_to_z = 0;
        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
        
      }


    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        //console.log(Math.abs(Math.sin(Math.PI*this.t/10)))
        //this.materials.sun.material = Color.of(0, 0, Math.abs(Math.sin(Math.PI*this.t/10)), 1), {ambient: 1};
        //sun_material = this.context.material( Color.of( 1,0,0,1 ), { ambient: 1});
        //this.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), { ambient:.2});
        //this.globals.get_instance( Phong_Shader).material(Color.of(1,1,0,1), {ambient:.2});
        //console.log(this.context);

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)


        //SUN
        let counter = Math.abs(Math.sin(((t % 10) / 10) * Math.PI)); // counts from 0 to 1 and back in 5 seconds each way
        let red = counter ; // red value changes in sin function
        let blue = 1-red;   // blue value changes in contrast to red value
        let sun_material = this.context.get_instance( Phong_Shader ).material( Color.of( red,0,blue,1 ),
         { ambient:1,
         specularity: 0,
         smoothness: 1,
         diffusivity: 0.1,
         gouraud: true} );

        let radius = (counter * 2) + 1;  // the scale the sun scale by, in this case: 2
        let scale = Mat4.scale(Vec.of(radius, radius, radius));  // Scaling Transformation matrix of the sun
        let model_transform_sun = Mat4.identity().times(scale)
        this.shapes.sun.draw( graphics_state, model_transform_sun, sun_material);

        //LIGHT SOURCE
        graphics_state.lights = [ new Light( Vec.of(0, 0, 0, 1), Color.of (red, 0, blue, 1), 10**radius) ];

        //PLANET1
        let rotate_speed_1 = t / 4;
        let translate_1 = Mat4.translation([5, 0, 5]);
        let rotate_1 = Mat4.rotation(Math.PI * rotate_speed_1, Vec.of(0, 1, 0));
        let model_transform_planet1 = this.planet_1 = Mat4.identity().times(rotate_1).times(translate_1).times(rotate_1);
        this.shapes.planet_1.draw( graphics_state, model_transform_planet1, this.materials.icy_gray);

        //PLANET2
        let even_odd = Math.round(t) % 2; // 0 and 1 for true and false every second passes
        let planet_2_material = this.context.get_instance( Phong_Shader ).material( Color.of( 0, 0.8, 0.8, 1),
         {diffusivity: 0.3,
         gouraud: even_odd} )   // Apply Gouraud shading to Planet 2 every odd second.
        let rotate_speed_2 = t / 6;
        let translate_2 = Mat4.translation([8, 0, 8]);
        let rotate_2 = Mat4.rotation(Math.PI * rotate_speed_2, Vec.of(0, 1, 0));
        let model_transform_planet2 = this.planet_2 = Mat4.identity().times(rotate_2).times(translate_2).times(rotate_2);
        this.shapes.planet_2.draw( graphics_state, model_transform_planet2, planet_2_material);

        //PLANET3


        // Wobble Algorithm
        if (t % 5 >= 0 && t % 5 <= 0.02)    //Generating a random number for x, y, z in between 0 and 1 every 5 seconds
        {
          this.wobble_to_x = Math.random();
          this.wobble_to_y = Math.random();
          this.wobble_to_z = Math.random();
        }
        if (Math.abs(this.wobble_x) >= 1 || this.wobble_x >= this.wobble_to_x)  //Only allowing the planet to wobble in
        {                                                                       //the range from -1 to 1 with respect to
          this.wobble_x_direction *= -1;                                        //PLANET3's x, y, z
        }
        if (Math.abs(this.wobble_y) >= 1 || this.wobble_y >= this.wobble_to_y)
        {
          this.wobble_y_direction *= -1;
        }
        if (Math.abs(this.wobble_z) >= 1 || this.wobble_z >= this.wobble_to_z)
        {
          this.wobble_z_direction *= -1;
        }

        this.wobble_x += this.wobble_x_direction;      // Incrementing by 0.01 in the direction each coordinate is changing
        this.wobble_y += this.wobble_y_direction;      // in (either increasing or decreasing the coordinate in the range of
        this.wobble_z += this.wobble_z_direction;      // 0 to 1)
        let wobble = Mat4.translation([this.wobble_x, this.wobble_y, this.wobble_z]);

        let rotate_speed_3 = t / 8;
        let translate_3 = Mat4.translation([11, 0, 11]);
        let rotate_3 = Mat4.rotation(Math.PI * rotate_speed_3, Vec.of(0, 1, 0));
        this.planet_3 = Mat4.identity().times(rotate_3).times(translate_3).times(rotate_3);
        let model_transform_planet3 = Mat4.identity().times(wobble).times(rotate_3).times(translate_3).times(rotate_3);


        let spin_speed = t / 2;
        let spin = Mat4.rotation(Math.PI * spin_speed, Vec.of( 0,1,1 ));
        let ring_scale = Mat4.scale(Vec.of(1, 1, 0.5));
        let model_transform_ring = Mat4.identity().times(wobble).times(rotate_3).times(translate_3).times(spin).times(ring_scale);
        this.shapes.planet_3.draw( graphics_state, model_transform_planet3, this.materials.muddy);
        this.shapes.planet_3_ring.draw( graphics_state, model_transform_ring, this.materials.muddy);

        //PLANET4
        let rotate_speed_4 = t / 10;
        let translate_4 = Mat4.translation([14, 0, 14]);
        let rotate_4 = Mat4.rotation(Math.PI * rotate_speed_4, Vec.of(0, 1, 0));
        let model_transform_planet4 = this.planet_4 = Mat4.identity().times(rotate_4).times(translate_4).times(rotate_4);
        this.shapes.planet_4.draw( graphics_state, model_transform_planet4, this.materials.soft_light_blue)

        //MOON
        let rotate_speed_moon = t / 2;
        let moon_rotate = Mat4.rotation(Math.PI * rotate_speed_moon, Vec.of(0, 1, 0));
        let off_axis_translation = Mat4.translation([2, 0, 2]);
        let model_transform_moon = this.moon = Mat4.identity().times(rotate_4).times(translate_4).times(moon_rotate).times(off_axis_translation);
        this.shapes.moon.draw( graphics_state, model_transform_moon, this.materials.green_moon);

        //CAMERA BUTTONS
        let translate = Mat4.translation([0,0,5]);      // move 5 units away from the center of the planet
        let desired = this.attached();
        if (this.attached() != this.initial_camera_location)
        {
          desired = this.attached().times(translate);
          desired = Mat4.inverse(desired);
          let blending_factor = 0.1;
          desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, blending_factor ) )
          this.context.globals.graphics_state.camera_transform = desired;
          this.is_view_solar = false;
        }
        else if(this.attached() == this.initial_camera_location && !this.is_view_solar)
        {
          this.is_view_solar = true;
          this.context.globals.graphics_state.camera_transform = Mat4.inverse(this.initial_camera_location);
        }
        
      }
  }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }