using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AngularCliNetcoreNgrxStarter
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment HostingEnvironment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            if (HostingEnvironment.IsProduction())
            {
                services.AddHttpsRedirection(options =>
                {
                    options.HttpsPort = 443;
                });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                // spa.UseSpaPrerendering(options =>
                // {
                //     options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.js";
                    
                //     // BootModuleBuilder Disabled - Building at runtime in dev enviroment was giving timeouts.
                //     // options.BootModuleBuilder = env.IsDevelopment()
                //     //     ? new AngularCliBuilder(npmScript: "build:ssr")
                //     //     : null;
                    
                //     options.ExcludeUrls = new[] { "/sockjs-node" };

                //     options.SupplyData = (context, data) =>
                //     {
                //          // Creates a new value called isHttpsRequest that is passed to TypeScript code
                //          data["isHttpsRequest"] = context.Request.IsHttps;
                //     };
                // });


                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
