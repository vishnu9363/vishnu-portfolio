import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Theme = 'light' | 'dark';

/**
 * Angular Component Lifecycle Flow (this portfolio):
 *
 * 1. constructor()     → Component class is created
 * 2. ngOnInit()        → Load saved theme before view renders
 * 3. ngAfterViewInit() → DOM is ready → start scroll animations & scroll spy
 * 4. window:scroll     → Update navbar, back-to-top & active menu on scroll
 * 5. ngOnDestroy()     → Disconnect observers and release resources
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  menuOpen = false;
  navbarScrolled = false;
  showBackToTop = false;
  activeSection = 'hero';
  theme: Theme = 'light';

  readonly hero = {
    name: 'Vishnu Suthar',
    role: 'Full Stack .NET Developer',
    phone: '+91-9700002922',
    email: 'vishnusuthar792@gmail.com',
    location: 'Sector 60, Mohali, PB –160071',
    linkedin: 'https://www.linkedin.com/in/vishnu-suthar-9619aa21a',
    github: 'https://github.com/vishnu9363',
  };

  readonly stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '5+', label: 'Projects Delivered' },
    { value: '60%', label: 'Performance Boost' },
  ];

  readonly navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly skillGroups = [
    {
      icon: 'fa-server',
      title: 'Backend',
      skills: ['ASP.NET Core', 'C#', '.NET 6/7/8', 'Entity Framework Core', 'Web API & MVC'],
    },
    {
      icon: 'fa-display',
      title: 'Frontend',
      skills: ['React.js', 'TypeScript', 'Blazor Server/WASM', 'Razor Pages', 'HTML5 / CSS3', 'Bootstrap / Tailwind'],
    },
    {
      icon: 'fa-database',
      title: 'Database & Architecture',
      skills: ['SQL Server 2019/2022', 'T-SQL, SPs & Triggers', 'Clean Architecture', 'CQRS & Repository Pattern', 'Dependency Injection'],
    },
    {
      icon: 'fa-diagram-project',
      title: 'Tools & Platforms',
      skills: ['Visual Studio / VS Code', 'Git & Azure DevOps', 'Postman', 'SSMS'],
    },
    {
      icon: 'fa-credit-card',
      title: 'Payments & APIs',
      skills: ['Stripe', 'Plaid API', 'ACH & Webhooks', 'PCI Compliance'],
    },
    {
      icon: 'fa-plus-circle',
      title: 'Other',
      skills: ['SignalR', 'RDLC Reports', 'Microservices'],
    },
  ];

  readonly experiences = [
    {
      company: 'LNP Infotech Pvt. Ltd.',
      period: 'Oct 2023 – Present',
      role: 'Software Developer',
      summary: 'Delivering enterprise-grade web applications using ASP.NET Core, React and Blazor with Clean Architecture and CQRS.',
      highlights: [
        'Developed full-stack modules with ASP.NET Core Web API, React.js and Blazor components.',
        'Implemented modular Clean Architecture with CQRS and clear separation of concerns.',
        'Integrated Plaid & Stripe for ACH and card payments with secure tokenization workflows.',
        'Built JWT-based authentication and role-based access for multi-tenant apps.',
      ],
    },
    {
      company: 'KMA Technoware Pvt. Ltd.',
      period: 'Jul 2022 – Sep 2023',
      role: 'Software Developer',
      summary: 'Worked on web solutions in audio management and education, focusing on performance, stability and clean code.',
      highlights: [
        'Designed normalized SQL Server databases and optimized complex queries.',
        'Delivered end-to-end features across MVC, Web API and RDLC reporting stack.',
        'Collaborated in Agile/Scrum teams and mentored junior developers.',
      ],
    },
  ];

  readonly projects = [
    {
      icon: 'fa-lightbulb',
      tech: ['ASP.NET Core', 'React', 'SignalR', 'SQL Server'],
      title: 'Light Show Management System',
      description: 'Synchronizes dynamic lighting patterns with real-time audio input for live events.',
      points: ['Real-time audio processing & light control.', 'SignalR-driven low-latency updates.', 'Configurable dashboards for event management.'],
    },
    {
      icon: 'fa-building',
      tech: ['ASP.NET Core', 'React', 'Clean Architecture', 'Plaid', 'Stripe'],
      title: 'Property Management System',
      description: 'End-to-end platform for real estate companies with automated financial workflows.',
      points: ['Tenant management, recurring billing and rent reconciliation.', 'ACH & card payments via Plaid + Stripe with PCI-compliant tokenization.', 'Role-based dashboards secured with JWT authorization.'],
    },
    {
      icon: 'fa-boxes-stacked',
      tech: ['Blazor Server', 'ASP.NET Core', 'Bootstrap', 'SQL Server'],
      title: 'Inventory Management System',
      description: 'Real-time stock tracking system for SMBs with interactive Blazor UI.',
      points: ['Barcode integration and automated re-order suggestions.', 'Live Blazor components for instantaneous updates.', 'Dashboards and reports for stock insights.'],
    },
    {
      icon: 'fa-music',
      tech: ['ASP.NET MVC', 'RDLC', 'SQL Server'],
      title: 'Audio Management Software',
      description: 'Legacy solution for file-based audio processing and metadata management with RDLC reports.',
      points: [],
    },
    {
      icon: 'fa-graduation-cap',
      tech: ['ASP.NET Core', 'SQL Server', 'Bootstrap'],
      title: 'Study App (Educational Platform)',
      description: 'Academic administration system covering courses, fees, exams and notifications.',
      points: [],
    },
  ];

  readonly currentYear = new Date().getFullYear();

  private revealObserver?: IntersectionObserver;
  private readonly scrollSpyOffset = 120;

  /** Step 4 — Runs on every scroll to keep UI in sync with the current section. */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.navbarScrolled = window.scrollY > 40;
    this.showBackToTop = window.scrollY > 500;
    this.updateActiveSection();
  }

  /** Step 2 — Initialize theme before the template binds. */
  ngOnInit(): void {
    this.initTheme();
  }

  /** Step 3 — View is rendered; safe to query DOM and attach observers. */
  ngAfterViewInit(): void {
    this.setupRevealAnimations();
    this.updateActiveSection();
  }

  /** Step 5 — Cleanup when the component is destroyed. */
  ngOnDestroy(): void {
    this.teardownObservers();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navigateTo(sectionId: string): void {
    this.activeSection = sectionId;
    this.closeMenu();
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.closeMenu();
  }

  sendMail(event: Event, name: string, email: string, message: string): void {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${this.hero.email}?subject=${subject}&body=${body}`;
  }

  /** Load theme from localStorage or system preference. */
  private initTheme(): void {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (current === 'light' || current === 'dark') {
      this.theme = current;
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  /** Fade-in sections as they enter the viewport. */
  private setupRevealAnimations(): void {
    const revealElements = document.querySelectorAll('.reveal');

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => this.revealObserver?.observe(el));
  }

  /** Highlight the nav link for the section currently in view. */
  private updateActiveSection(): void {
    if (window.scrollY < 80) {
      this.activeSection = 'hero';
      return;
    }

    let current = this.navLinks[0].id;

    for (const link of this.navLinks) {
      const section = document.getElementById(link.id);
      if (!section) {
        continue;
      }

      if (section.getBoundingClientRect().top <= this.scrollSpyOffset) {
        current = link.id;
      }
    }

    this.activeSection = current;
  }

  private applyTheme(theme: Theme): void {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  private teardownObservers(): void {
    this.revealObserver?.disconnect();
    this.revealObserver = undefined;
  }
}
